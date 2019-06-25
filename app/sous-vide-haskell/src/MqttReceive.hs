module MqttReceive where

import Control.Concurrent
    (Chan, newChan, readChan, writeChan)

getMsg :: Chan String -> String -> String -> String -> IO ()    
getMsg ch mtype topic msg = writeChan ch msg