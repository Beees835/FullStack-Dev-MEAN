export class Driver {
    _id: string = '';                // The unique identifier for the driver
    driver_id: string = '';           // The unique identifier for the driver
    driver_name: string = '';        // The name of the driver
    driver_department: string = '';  // The department the driver belongs to
    driver_licence: string = '';     // The driver's license number (renamed to match backend)
    driver_isActive: boolean = true; // Track if the driver is active
    driver_createdAt: Date = new Date();  // Date when the driver was added
  
    constructor(init?: Partial<Driver>) {
      Object.assign(this, init);  // Optionally initialize with partial data
    }
}
