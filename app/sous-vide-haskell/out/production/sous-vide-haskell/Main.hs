{-# LANGUAGE OverloadedStrings #-}

module Main where

import System.Environment
import Lib
import Network.MQTT.Client
import MqttEnv
import Control.Concurrent
  (Chan, newChan, readChan, writeChan)
import MqttReceive

main :: IO ()
main = do
    c <- newChan
    host_port <- getHostPort
    case host_port of
        (Just (host,port)) -> do
            mc <- runClient mqttConfig{_hostname=host, _msgCB=getMsg <$> Just c}
            putStrLn "Connected!"
            publish mc "tmp/topic" "hello!" False