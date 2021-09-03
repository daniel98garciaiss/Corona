function Load(o) {
    o.image =  o.system.type + ".png"
}

function Update(o)
{
    o.name = o.system.name
    o.state = o.system.stateName 
    suffix = ""
    switch (o.system.type) {
        case "GENERIC_AREA":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = "_UNKNOWN"
                    break
                case "DISCONNECTED":
                    suffix = "_DISCONNECTED"
                    break
                case "ARMED":
                case "ARMED_EARLY":
                case "FORCED_ARMING":
                case "LATE_TO_ARM":
                    suffix = "__ARMED"
                    break
                case "DISARMED":
                case "DISARMED_EARLY":
                case "LATE_TO_DISARM":
                    suffix = "_DISARMED"
                    o.blinking = true
                    break
                case "WALK_TEST_STARTED":
                case "WALK_TEST_ENDED":
                 suffix = "_WALK_TEST_STARTED"
                 o.blinking = true
                    break
                default:
                suffix ="_UNKNOWN"
                break
              }
              break

        case "GENERIC_DOOR":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = ""
                    break
                case "CLOSED":
                case "CONNECTED":
                    suffix = "_CLOSED"
                    break
                case "ACCESS_DENIED":
                    suffix = "_ACCESS_DENIED"
                    break                  
                case "DISCONNECTED":
                    suffix = "_DISCONNECTED"
                    break                   
                case "FORCED":
                case "TAMPERED":
                    suffix = "_FORCED"
                    break
                case "HELD_OPEN":
                    suffix = "_HELD_OPEN"
                    break
                case "ACCESS_GRANTED":
                case "OPEN":
                    suffix = "_ACCESS_GRANTED"
                    break
                case "INSECURE":
                case "UNLOCKED":
                suffix = "_UNLOCKED"
                    break
                case "LOCKED":
                case "SECURED":
                    suffix = "_LOCKED"
                    break
                default:
                  suffix =""
                  break
            }
            break

        case "GENERIC_FIRE_DETECTOR":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = ""
                    break
                case "ALARMED":
                    suffix = "_ALARMED"
                    o.blinking = true
                    break
                case "CIRCUIT_OPENED":
                    suffix = "_CIRCUIT_OPENED"
                    break
                case "CIRCUT_SHORTED":
                case "NORMAL":
                    suffix = "_CIRCUT_SHORTED"
                    break
                case "TAMPERED":
                    suffix = "_TAMPERED"
                    o.blinking = true
                    break
                default:
                  suffix =""
                  break
            }
            break

        case "GENERIC_SMOKE_DETECTOR":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = ""
                    break
                case "ALARMED":
                    suffix = "_ALARMED"
                    o.blinking = true
                    break
                case "CIRCUT_SHORTED":
                    suffix = "_CIRCUIT_OPENED"
                    break
                case "CIRCUIT_OPENED":
                case "NORMAL":
                    suffix = "_CIRCUT_SHORTED"
                    break
                case "TAMPERED":
                    suffix = "_TAMPERED"
                    o.blinking = true
                    break
                default:
                  suffix =""
                  break
            }
            break

        case "GENERIC_INPUT":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = ""
                    break
                case "ALARMED":
                case "TAMPERED":
                    suffix = "_ALARMED"
                    break
                case "CLOSED":
                case "DEACTIVATED":
                case "DISCONNECTED":
                    suffix = "_CLOSED"
                    break
                case "ACTVATED":
                case "CONNECTED":
                case "OPENED":
                    suffix = "_ACTVATED"
                    o.blinking = true
                    break
                default:
                  suffix =""
                  break
            }
            break

        case "GENERIC_SENSOR":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = ""
                    break
                case "ALARMED":
                case "TAMPERED":
                    suffix = "_ALARMED"
                    break
                case "CLOSED":
                case "DEACTIVATED":
                case "DISCONNECTED":
                    suffix = "_CLOSED"
                    break
                case "ACTVATED":
                case "CONNECTED":
                case "OPENED":
                    suffix = "_ACTVATED"
                    o.blinking = true
                    break
                default:
                  suffix =""
                  break
            }
            break

        case "GENERIC_OUTPUT":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = ""
                    break
                case "ALARMED":
                case "TAMPERED":
                    suffix = "_ALARMED"
                    break
                case "OFF":
                case "DEACTIVATED":
                case "CONNECTED":
                    suffix = "_CONNECTED"
                    break
                case "ACTVATED":
                case "ON":
                    suffix = "_ACTVATED"
                    o.blinking = true
                    break
                case "DISCONNECTED":
                    suffix = "_DISCONNECTED"
                    break                    
                default:
                  suffix =""
                  break
            }
            break

        case "GENERIC_RELAY":
            switch (o.system.state) {
                case "UNKNOWN":
                    suffix = "_UNKNOWN"
                    break
                case "TAMPERED":
                    suffix = "_TAMPERED"
                    break
                case "OFF":
                case "DEACTIVATED":
                case "CONNECTED":
                    suffix = "_CONNECTED"
                    break
                case "ACTVATED":
                case "ON":
                    suffix = "_ACTVATED"
                    o.blinking = true
                    break 
                case "DISCONNECTED":
                    suffix = "_DISCONNECTED"
                    break                    
                default:
                  suffix =""
                  break
            }
            break

        case "RECEIVER":
        switch (o.system.state) {
            case "UNKNOWN":
            case "NORMAL":
                    suffix = "_NORMAL"
                    break    
            case "ALARMED":
                    suffix = "_ERROR"
                    break 
            default:
                  suffix =""
                break
        }
        break

        case "PANEL":
        switch (o.system.state) {
            case "UNKNOWN":
            case "CONNECTED":
                    suffix = "_CONNECTED"
                    break    
            case "DISCONNECTED":
            case "ALARMED":
                    suffix = "_DISCONNECTED"
                    break 
            default:
                  suffix =""
                break
        }
        break


        case "PARTITION":
        switch (o.system.state) {
            case "UNKNOWN":
            case "ARMED":
            case "NORMAL":
                    suffix = "_ARMED"
                    break    
            case "DISARMED":
            case "ALARMED":
                    suffix = "_DISARMED"
                    break 
            default:
                  suffix =""
                break
        }
        break

        case "SENSOR":
        switch (o.system.state) {
            case "UNKNOWN":
            case "NORMAL":            
                    suffix = "_NORMAL"
                    break    
            case "ALARMED":
                    suffix = "_ALARMED"
                    break 
            case "BYPASSED":
                    suffix = "_BYPASSED"
                    break 
            default:
                  suffix =""
                break
        }
        break

    }
    
    o.image = o.system.type + suffix + ".png"
}
 
function MenuFilter(o, action) {
    return o.system.rights >= 2;
}

IntegrationServer = { load: Load, update: Update, menuFilter: MenuFilter }

area = Object.assign({}, IntegrationServer)
area.uninitializedIcon = "GENERIC_AREA.png"
door = Object.assign({}, IntegrationServer)
door.uninitializedIcon = "GENERIC_DOOR.png"
fireDetector = Object.assign({}, IntegrationServer)
fireDetector.uninitializedIcon = "GENERIC_FIRE_DETECTOR.png"
smokeDetector = Object.assign({}, IntegrationServer)
smokeDetector.uninitializedIcon = "GENERIC_SMOKE_DETECTOR.png"
input = Object.assign({}, IntegrationServer)
input.uninitializedIcon = "GENERIC_INPUT.png"
gensensor = Object.assign({}, IntegrationServer)
gensensor.uninitializedIcon = "GENERIC_SENSOR.png"
output = Object.assign({}, IntegrationServer)
output.uninitializedIcon = "GENERIC_OUTPUT.png"
relay = Object.assign({}, IntegrationServer)
relay.uninitializedIcon = "GENERIC_RELAY.png"
receiver = Object.assign({}, IntegrationServer)
receiver.uninitializedIcon = "RECEIVER.png"
panel = Object.assign({}, IntegrationServer)
panel.uninitializedIcon = "PANEL.png"
partition = Object.assign({}, IntegrationServer)
partition.uninitializedIcon = "PARTITION.png"
sensor = Object.assign({}, IntegrationServer)
sensor.uninitializedIcon = "SENSOR.png"

Map.registerType("GENERIC_AREA", area)
Map.registerType("GENERIC_DOOR", door)
Map.registerType("GENERIC_FIRE_DETECTOR", fireDetector)
Map.registerType("GENERIC_SMOKE_DETECTOR", smokeDetector)
Map.registerType("GENERIC_INPUT", input)
Map.registerType("GENERIC_SENSOR", gensensor)
Map.registerType("GENERIC_OUTPUT", output)
Map.registerType("GENERIC_RELAY", relay)
Map.registerType("RECEIVER", receiver)
Map.registerType("PANEL", panel)
Map.registerType("PARTITION", partition)
Map.registerType("SENSOR", sensor)