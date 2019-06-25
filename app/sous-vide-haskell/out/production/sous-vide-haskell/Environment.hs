module Environment where

import System.Environment
import Control.Monad.Trans.Maybe
import Control.Monad.IO.Class

getHostPort :: MaybeT IO (Maybe String, Maybe String)
getHostPort = do 
    host <- liftIO $ lookupEnv "MQTT_HOST"
    port <- liftIO $ lookupEnv "MQTT_PORT"
    return (host, port)