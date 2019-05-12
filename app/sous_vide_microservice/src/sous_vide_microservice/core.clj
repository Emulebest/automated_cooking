(ns sous-vide-microservice.core
  (:require [taoensso.carmine :as car :refer (wcar)]
            [clojure.core.async :as a :refer [>! <! >!! <!! go chan buffer close! thread
                                              alts! alts!! timeout go-loop alt!]]
            [clojure.data.json :as json]
            [clojurewerkz.machine-head.client :as mh]))

(defn get-msg
  [topic conn ch]
  (car/with-new-pubsub-listener
    (:spec conn)
    {topic (fn [msg] (do
                       (println "Got " msg)
                       (go (>! ch msg))))}
    (car/subscribe topic)))

(defn mqtt-sub
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

(defn process-msg
  [msg users]
  ())

(defn handle-redis-msg
  [msg-type channel msg]
  (case msg-type
    "message" (println (convert-msg msg))
    "subscribe" (println "Subscribed to" channel)))

(defn handle-mqtt-msg
  [topic payload]
  (println "Got msg" payload "In topic" topic))

(defn -main
  "I don't do a whole lot."
  [& args]
  (let [server1-conn {:pool {} :spec {:uri "redis://redis:6379"}}
        c1 (chan)
        c2 (chan)
        listener (get-msg "sous-vide" server1-conn c1)
        mqtt_conn (mqtt-sub "tcp://mosquitto:1883" ["tp:1" "tp:2"] c2)]
    (go-loop []
      (alt!
        c1 ([[msg-type channel msg]] (handle-redis-msg msg-type channel msg))
        c2 ([[topic payload]] (handle-mqtt-msg topic payload)))
      (recur)))
  )


