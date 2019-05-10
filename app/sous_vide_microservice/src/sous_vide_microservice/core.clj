(ns sous-vide-microservice.core
  (:require [taoensso.carmine :as car :refer (wcar)]
            [clojure.core.async :as a :refer [>! <! >!! <!! go chan buffer close! thread
                                              alts! alts!! timeout]]))

(defn get-msg
  [topic conn ch]
  (car/with-new-pubsub-listener
    (:spec conn)
    {topic #(go (>! ch %))}
    (car/subscribe topic)))

(defn -main
  "I don't do a whole lot."
  [& args]
  (let [server1-conn {:host "localhost" :port 6379}
        c1 (chan)
        listener (get-msg "sous-vide" server1-conn c1)]
    (go (println (<!! c1)))
    ))


