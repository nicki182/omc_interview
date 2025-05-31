import { MalfunctionWithSensor } from "@types";
export class MalfunctionDTO {
    private id: number;
    private sensor_id: number;
    private timestamp: number;
    private temperature_value: number;
    private deviation: number;
    private sensor: MalfunctionWithSensor["sensor"];
    
    public getId(): number {
        return this.id;
    }
    
    public getSensorId(): number {
        return this.sensor_id;
    }
    
    public getTimestamp(): number {
        return this.timestamp;
    }
    
    public getTemperature(): number {
        return this.temperature_value;
    }
    public getDeviation(): number {
        return this.deviation;
    }
    
    public getSensor(): MalfunctionWithSensor["sensor"] {
        return this.sensor;
    }
    
    public static from(malfunction: MalfunctionWithSensor): MalfunctionDTO {
        const dto = new MalfunctionDTO();
        dto.id = malfunction.id;
        dto.sensor_id = malfunction.sensor_id || malfunction.sensor?.id || 0; // Ensure sensor_id is defined
        dto.timestamp = malfunction.timestamp;
        dto.temperature_value = malfunction.temperature_value;
        dto.deviation = malfunction.deviation;
        dto.sensor = malfunction.sensor || ({} as MalfunctionWithSensor["sensor"]); // Ensure sensor is defined
        return dto;
    }
}