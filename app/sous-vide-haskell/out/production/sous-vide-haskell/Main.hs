{-# LANGUAGE OverloadedStrings #-}

module Main where

import System.Environment
import Lib
import Network.MQTT.Client

main :: IO ()
main = do
    let host = lookupEnv "MQTT_HOST"
    mc <- runClient mqttConfig{_hostname="localhost"}
    publish mc "tmp/topic" "hello!" False