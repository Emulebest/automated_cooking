{-# LANGUAGE OverloadedStrings #-}

module Main where

import Network.MQTT.Client
import MqttEnv
import Control.Concurrent (newChan)
import MqttReceive
import Control.Concurrent.Async (async)
import Control.Monad (forever)
import Data.ByteString.Lazy.Char8 (ByteString)

main :: IO ()
main = do
  c <- newChan
  host_port <- getHostPort
  case host_port of
    (Just (host, port)) -> do
      mc <- runClient mqttConfig {_hostname = host, _msgCB = getMsg <$> Just c, _port = port}
      print =<< subscribe mc [("tmp/msg", QoS0)]
      _ <- async $ forever printMsg c
      publish mc "tmp/msg" "hello!" False
    Nothing -> print ("No env variables set" :: ByteString)
