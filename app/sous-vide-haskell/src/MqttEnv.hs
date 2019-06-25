module MqttEnv where

import System.Environment
import Control.Monad.Trans.Maybe
import Control.Monad.IO.Class

getHostPort :: IO (Maybe (String, String))
getHostPort = do 
    host <- lookupEnv "MQTT_HOST"
    port <- lookupEnv "MQTT_PORT"
    case (host, port) of
        (Nothing, _) -> return Nothing
        (Just h, Just p) -> return $ Just (h,p)