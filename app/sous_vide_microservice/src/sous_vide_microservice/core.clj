(ns sous-vide-microservice.core
  (:require [taoensso.carmine :as car :refer (wcar)]
            [clojure.core.async :as a :refer [>! <! >!! <!! go chan buffer close! thread
                                              alts! alts!! timeout go-loop]]))

(defn get-msg
  [topic conn ch]
  (car/with-new-pubsub-listener
    (:spec conn)
    {topic (fn [msg] (do
                       (println "Got " msg)
                       (go (>! ch msg))))}
    (car/subscribe topic)))

(defn -main
  "I don't do a whole lot."
  [& args]
  (let [server1-conn {:pool {} :spec {:uri "redis://redis:6379"}}
        c1 (chan)
        listener (get-msg "sous-vide" server1-conn c1)]
    (go-loop []
      (let [[_ _ msg] (<! c1)]
        (println msg)
        (recur)))
    ))


