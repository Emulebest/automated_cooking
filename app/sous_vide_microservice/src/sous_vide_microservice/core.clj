(ns sous-vide-microservice.core
  (:require [taoensso.carmine :as car :refer (wcar*)]
            [clojure.core.async :as a :refer [>! <! >!! <!! go chan buffer close! thread
                                              alts! alts!! timeout go-loop alt!]]
            [clojure.data.json :as json]
            [clojurewerkz.machine-head.client :as mh]))

(defrecord Device [topic temp])

(defn get-msg
  [topic conn ch]
  (car/with-new-pubsub-listener
    (:spec conn)
    {topic (fn [msg] (do
                       (println "Got " msg)
                       (go (>! ch msg))))}
    (car/subscribe topic)))

(defn mqtt-subscribe
  [addr topics ch]
  (let [mqtt-conn (mh/connect addr)]
    (doseq [topic topics]
      (mh/subscribe mqtt-conn {topic 0} (fn [^String topic _ ^bytes payload]
                                          (go (>! ch [topic (String. payload)]))))
      mqtt-conn)))

(defn convert-msg
  [msg]
  (try
    (json/read-str msg :key-fn keyword)
    (catch Exception e (println (str "Got exception while parsing json " (.toString e))))))


(defn filter-device
  [topic devices]
  (filter #(= topic (:topic %)) devices))

(defn devices-contain?
  [topic devices]
  (-> (filter-device topic devices)
      first
      empty?))

(defn handle-redis-msg
  [msg-type channel msg user-device]
  (case msg-type
    "message"
    (let [converted (convert-msg msg)
          {user  :user
           topic :topic
           type  :type} converted
          new-device (.Device topic 40)]
      (case type
        "connect"
        (swap! user-device update-in [user] (fnil #(if (devices-contain? topic %) % (conj % new-device)) []))))
    "subscribe"
    (println "Subscribed to" channel)))

(defn find-device-user
  [^String device-topic user-device]
  (comp first (reduce-kv (fn [acc k v]
                           (let [filtered-records (filter-device device-topic v)
                                 target-device (-> filtered-records
                                                   first)]
                             (if (not (nil? target-device)) (conj acc [k v]) acc)))
                         [] @user-device)))

(defn write-command
  [topic command ch]
  (go
    (>! ch [topic (json/write-str {"command" command})])))

(defn process-mqtt-temp
  ([ch msg topic]
   (let [temp (:temp msg)]
     (cond
       (< temp 40.1) (write-command topic "on" ch)
       (> temp 40.5) (write-command topic "off" ch))))
  ([ch msg topic temp-set]
   (let [temp (:temp msg)]
     (cond
       (< temp (+ temp-set 0.1)) (write-command topic "on" ch)
       (> temp (+ temp-set 0.5)) (write-command topic "off" ch)))))

(defn send-redis-temp
  ([ch msg topic user]
   (go (>! ch (json/write-str {"user" user, "topic" topic, "temp" (:temp msg)})))))

(defn handle-mqtt-msg
  [topic payload user-device mqtt-pub-chan redis-pub-chan]
  (let [msg (convert-msg payload)
        [user device] (find-device-user topic user-device)]
    (case (:type msg)
      "temp"
      (cond
        (or (nil? user) (nil? device)) (process-mqtt-temp mqtt-pub-chan msg topic)
        :else (do
                (process-mqtt-temp mqtt-pub-chan msg topic (:temp device))
                (send-redis-temp redis-pub-chan msg topic user))))))

(defn -main
  "I don't do a whole lot."
  [& args]
  (let [server1-conn {:pool {} :spec {:uri "redis://redis:6379"}}
        redis-sub (chan)
        mqtt-sub (chan)
        mqtt-pub (chan)
        redis-pub (chan)
        redis-listener (get-msg "sous-vide" server1-conn redis-sub)
        mqtt_conn (mqtt-subscribe "tcp://mosquitto:1883" ["tp:1" "tp:2"] mqtt-sub)
        user-device (atom {})]
    (go-loop []
      (alt!
        redis-sub ([[msg-type channel msg]] (handle-redis-msg msg-type channel msg user-device))
        mqtt-sub ([[topic payload]] (handle-mqtt-msg topic payload user-device mqtt-pub redis-pub))
        mqtt-pub ([[topic payload]] (mh/publish mqtt_conn topic payload))
        redis-pub ([payload] (car/wcar server1-conn (car/publish "sous-vide" payload))))
      (recur)))
  )


