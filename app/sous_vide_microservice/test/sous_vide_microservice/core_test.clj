(ns sous-vide-microservice.core-test
  (:require [taoensso.carmine :as car]
            [clojure.core.async :as a :refer [>! <! >!! <!! go chan buffer close! thread
                                              alts! alts!! timeout go-loop alt!]]
            [clojure.data.json :as json]
            [clojurewerkz.machine-head.client :as mh]
            [clojure.test :refer :all]
            [sous-vide-microservice.core :refer :all])
  (:import (sous_vide_microservice.core Device)))

(def server1-conn {:pool {} :spec {:uri "redis://redis:6379"}})

(defn setUp [f]
  (-main)
  (f))

(use-fixtures :once setUp)

(deftest connect-test
  (testing "Connect-device"
    (let [redis-sub (chan)
          mqtt-sub (chan)
          devices (atom {0 (Device. 0 99999 ["test/temp" "keyUp"] 40)})
          _ (get-msg "sous-vide" server1-conn redis-sub)
          mqtt_conn (mqtt-subscribe "tcp://mosquitto:1883" devices mqtt-sub)]
      (do
        (car/wcar server1-conn (car/publish "sous-vide" (json/write-str {"user" 1, "device" 0, "type" "connect"})))
        (mh/publish mqtt_conn "keyUp" "1")
        )
      (let [_ (doseq [x (range 2)]
                (println (<!! redis-sub)))
            [_ _ msg] (<!! redis-sub)
            msg (parse-msg msg)]
        (println "Finally Got in connect-test " msg)
        (is (= (:type msg) "connected"))
        (is (= (:user msg) 1))
        (is (= (:device msg) 0))))))

(deftest temp-test
  (testing "Test temperature"
    (let [redis-sub (chan)
          mqtt-sub (chan)
          devices (atom {0 (Device. 0 99999 ["test/temp" "keyUp" "device_ctl"] 40)})
          _ (get-msg "sous-vide" server1-conn redis-sub)
          mqtt_conn (mqtt-subscribe "tcp://mosquitto:1883" devices mqtt-sub)]
      (do
        (car/wcar server1-conn (car/publish "sous-vide" (json/write-str {"user" 1, "device" 0, "type" "connect"})))
        (mh/publish mqtt_conn "keyUp" "1")
        (mh/publish mqtt_conn "test/temp" "42"))
      (let [_ (dotimes [_ 3]
                (println (<!! redis-sub)))
            [_ _ msg] (<!! redis-sub)
            msg (parse-msg msg)
            _ (dotimes [_ 2]
                (println (<!! mqtt-sub)))
            [topic payload] (<!! mqtt-sub)]
        (println "Overheating 42")
        (println "Finally got in temp-test " msg)
        (is (= (:type msg) "show-temp"))
        (is (= (:temp msg) 42))
        (is (= topic "device_ctl"))
        (is (= payload "0"))
        )
      (mh/publish mqtt_conn "test/temp" "38")
      (let [_ (dotimes [_ 1] (println (<!! mqtt-sub)))
            [topic payload] (<!! mqtt-sub)]
        (println "Temperature is falling to 38")
        (println "Got topic " topic "Payload " payload)
        (is (= topic "device_ctl"))
        (is (= payload "1")))))

  (testing "Test setting temp"
    (let [redis-sub (chan)
          mqtt-sub (chan)
          devices (atom {0 (Device. 0 99999 ["test/temp" "keyUp" "device_ctl"] 40)})
          _ (get-msg "sous-vide" server1-conn redis-sub)
          mqtt_conn (mqtt-subscribe "tcp://mosquitto:1883" devices mqtt-sub)]
      (do
        (car/wcar server1-conn (car/publish "sous-vide" (json/write-str {"user" 1, "device" 0, "type" "connect"})))
        (mh/publish mqtt_conn "keyUp" "1")
        (car/wcar server1-conn (car/publish "sous-vide" (json/write-str {"user" 1, "device" 0, "type" "set_temp", "temp" 70})))
        (mh/publish mqtt_conn "test/temp" "42"))
      (let [_ (dotimes [_ 4]
                (println (<!! redis-sub)))
            [_ _ msg] (<!! redis-sub)
            msg (parse-msg msg)
            _ (dotimes [_ 2]
                (println (<!! mqtt-sub)))
            [topic payload] (<!! mqtt-sub)]
        (println "Finally got in temp-test " msg)
        (is (= (:type msg) "show-temp"))
        (is (= (:temp msg) 42))
        (is (= topic "device_ctl"))
        (is (= payload "1"))
        )
      (mh/publish mqtt_conn "test/temp" "69")
      (let [_ (dotimes [_ 1] (println (<!! mqtt-sub)))
            [topic payload] (<!! mqtt-sub)]
        (println "Temperature is 69, nearly 70")
        (println "Got topic " topic "Payload " payload)
        (is (= topic "device_ctl"))
        (is (= payload "1")))
      (mh/publish mqtt_conn "test/temp" "71")
      (let [_ (dotimes [_ 1] (println (<!! mqtt-sub)))
            [topic payload] (<!! mqtt-sub)]
        (println "Temperature is 71, overheating")
        (println "Got topic " topic "Payload " payload)
        (is (= topic "device_ctl"))
        (is (= payload "0"))))))
