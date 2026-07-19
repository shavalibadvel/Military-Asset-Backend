var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var connectDB = require("./db");

var Base = require("./models/Base");
var EquipmentType = require("./models/EquipmentType");
var User = require("./models/User");
var Purchase = require("./models/Purchase");
var Transfer = require("./models/Transfer");
var Assignment = require("./models/Assignment");
var Expenditure = require("./models/Expenditure");
var AuditLog = require("./models/Auditlog");

async function seed() {
  await connectDB();
  await Base.deleteMany({});
  await EquipmentType.deleteMany({});
  await User.deleteMany({});
  await Purchase.deleteMany({});
  await Transfer.deleteMany({});
  await Assignment.deleteMany({});
  await Expenditure.deleteMany({});
  await AuditLog.deleteMany({});
  console.log("deleting collections");


  var alpha = new Base({ name: "Alpha Base", location: "Northern Region" });
  await alpha.save();

  var bravo = new Base({ name: "Bravo Base", location: "Southern Region" });
  await bravo.save();

  var charlie = new Base({ name: "Charlie Base", location: "Eastern Region" });
  await charlie.save();

  console.log("Created three bases: Alpha, Bravo, Charlie.");

  var m4 = new EquipmentType({ name: "M4 Carbine", category: "Weapons" });
  await m4.save();

  var m9 = new EquipmentType({ name: "M9 Pistol", category: "Weapons" });
  await m9.save();

  var humvee = new EquipmentType({ name: "Humvee", category: "Vehicles" });
  await humvee.save();

  var truck = new EquipmentType({ name: "Transport Truck", category: "Vehicles" });
  await truck.save();

  var ammo556 = new EquipmentType({ name: "5.56mm Rounds", category: "Ammunition" });
  await ammo556.save();

  var ammo9 = new EquipmentType({ name: "9mm Rounds", category: "Ammunition" });
  await ammo9.save();

  var armor = new EquipmentType({ name: "Body Armor", category: "Equipment" });
  await armor.save();

  var nvg = new EquipmentType({ name: "Night Vision Goggles", category: "Equipment" });
  await nvg.save();

  console.log("Created 8 equipment types.");

  var hashedPassword = bcrypt.hashSync("password123", 10);

  var admin = new User({
    username: "admin",
    password: hashedPassword,
    full_name: "System Admin",
    role: "Admin",
    base_id: null
  });
  await admin.save();

  var cmdrAlpha = new User({
    username: "cmdr_alpha",
    password: hashedPassword,
    full_name: "Col. Smith",
    role: "Base Commander",
    base_id: alpha._id
  });
  await cmdrAlpha.save();

  var cmdrBravo = new User({
    username: "cmdr_bravo",
    password: hashedPassword,
    full_name: "Col. Jones",
    role: "Base Commander",
    base_id: bravo._id
  });
  await cmdrBravo.save();

  var logistics = new User({
    username: "logistics1",
    password: hashedPassword,
    full_name: "Lt. Williams",
    role: "Logistics Officer",
    base_id: null
  });
  await logistics.save();

  console.log("Created 4 users.");

  var purchase1 = new Purchase({ base_id: alpha._id, equipment_type_id: m4._id, quantity: 50, date: "2025-01-15", notes: "Initial procurement", created_by: admin._id });
  await purchase1.save();

  var purchase2 = new Purchase({ base_id: alpha._id, equipment_type_id: ammo556._id, quantity: 10000, date: "2025-01-15", notes: "Ammo supply", created_by: admin._id });
  await purchase2.save();

  var purchase3 = new Purchase({ base_id: alpha._id, equipment_type_id: humvee._id, quantity: 10, date: "2025-01-20", notes: "Vehicle fleet", created_by: admin._id });
  await purchase3.save();

  var purchase4 = new Purchase({ base_id: bravo._id, equipment_type_id: m4._id, quantity: 40, date: "2025-01-18", notes: "Initial procurement", created_by: admin._id });
  await purchase4.save();

  var purchase5 = new Purchase({ base_id: bravo._id, equipment_type_id: ammo556._id, quantity: 8000, date: "2025-01-18", notes: "Ammo supply", created_by: admin._id });
  await purchase5.save();

  var purchase6 = new Purchase({ base_id: bravo._id, equipment_type_id: armor._id, quantity: 30, date: "2025-02-01", notes: "Body armor delivery", created_by: logistics._id });
  await purchase6.save();

  var purchase7 = new Purchase({ base_id: charlie._id, equipment_type_id: m9._id, quantity: 25, date: "2025-02-05", notes: "Sidearm procurement", created_by: logistics._id });
  await purchase7.save();

  var purchase8 = new Purchase({ base_id: charlie._id, equipment_type_id: truck._id, quantity: 5, date: "2025-02-10", notes: "Transport vehicles", created_by: admin._id });
  await purchase8.save();

  var purchase9 = new Purchase({ base_id: alpha._id, equipment_type_id: nvg._id, quantity: 20, date: "2025-03-01", notes: "NVG procurement", created_by: logistics._id });
  await purchase9.save();

  console.log("Created 9 purchases.");

  var transfer1 = new Transfer({ from_base_id: alpha._id, to_base_id: bravo._id, equipment_type_id: m4._id, quantity: 10, date: "2025-02-15", notes: "Reinforcement transfer", created_by: logistics._id });
  await transfer1.save();

  var transfer2 = new Transfer({ from_base_id: alpha._id, to_base_id: charlie._id, equipment_type_id: ammo556._id, quantity: 2000, date: "2025-02-20", notes: "Ammo resupply", created_by: logistics._id });
  await transfer2.save();

  var transfer3 = new Transfer({ from_base_id: bravo._id, to_base_id: charlie._id, equipment_type_id: armor._id, quantity: 10, date: "2025-03-01", notes: "Equipment redistribution", created_by: logistics._id });
  await transfer3.save();

  console.log("Created 3 transfers.");
  var assign1 = new Assignment({ base_id: alpha._id, equipment_type_id: m4._id, personnel_name: "Sgt. Martinez", quantity: 2, date: "2025-02-01", created_by: cmdrAlpha._id });
  await assign1.save();

  var assign2 = new Assignment({ base_id: alpha._id, equipment_type_id: armor._id, personnel_name: "Sgt. Martinez", quantity: 1, date: "2025-02-01", created_by: cmdrAlpha._id });
  await assign2.save();

  var assign3 = new Assignment({ base_id: bravo._id, equipment_type_id: m4._id, personnel_name: "Cpl. Taylor", quantity: 1, date: "2025-02-20", created_by: cmdrBravo._id });
  await assign3.save();

  var assign4 = new Assignment({ base_id: alpha._id, equipment_type_id: humvee._id, personnel_name: "Lt. Davis", quantity: 1, date: "2025-03-05", created_by: cmdrAlpha._id });
  await assign4.save();

  console.log("Created 4 assignments.");

  var expend1 = new Expenditure({ base_id: alpha._id, equipment_type_id: ammo556._id, quantity: 500, reason: "Training exercise", date: "2025-02-10", created_by: cmdrAlpha._id });
  await expend1.save();

  var expend2 = new Expenditure({ base_id: bravo._id, equipment_type_id: ammo556._id, quantity: 300, reason: "Range qualification", date: "2025-02-25", created_by: cmdrBravo._id });
  await expend2.save();

  var expend3 = new Expenditure({ base_id: alpha._id, equipment_type_id: ammo556._id, quantity: 200, reason: "Field exercise", date: "2025-03-10", created_by: cmdrAlpha._id });
  await expend3.save();

  console.log("Created 3 expenditures.");
  console.log("");
  console.log("=== Seeding Complete ===");
  console.log("");
  console.log("Test Accounts (all passwords: password123):");
  console.log("  admin        -> Admin (full access)");
  console.log("  cmdr_alpha   -> Base Commander (Alpha Base only)");
  console.log("  cmdr_bravo   -> Base Commander (Bravo Base only)");
  console.log("  logistics1   -> Logistics Officer (purchases & transfers only)");

  await mongoose.disconnect();
}

seed().catch(function (error) {
  console.log("Seeding failed:", error);
  process.exit(1);
});