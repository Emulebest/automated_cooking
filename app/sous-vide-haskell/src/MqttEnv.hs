module MqttEnv where

import System.Environment
import Text.Read (readMaybe)

getHostPort :: IO (Maybe (String, Int))
getHostPort = do
  host <- lookupEnv "MQTT_HOST"
  port <- lookupEnv "MQTT_PORT"
  case (host, port) of
    (Nothing, _) -> return Nothing
    (_, Nothing) -> return Nothing
    (Just h, Just p) ->
      case readMaybe p :: Maybe Int of
        (Just prt) -> return $ Just (h, prt)