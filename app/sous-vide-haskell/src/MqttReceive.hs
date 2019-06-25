module MqttReceive where

import Control.Concurrent
    (Chan, readChan, writeChan)
import Network.MQTT.Client (MQTTClient, Topic)
import Data.ByteString.Lazy.Char8 (ByteString)

getMsg :: Chan ByteString -> MQTTClient -> Topic -> ByteString -> IO ()
getMsg ch _ _ = writeChan ch


printMsg :: Chan ByteString -> IO ()
printMsg ch = readChan ch >>= print