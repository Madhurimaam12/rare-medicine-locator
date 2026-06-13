const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://madhurima:madhurima@cluster0.farh4i4.mongodb.net/raremedicine?retryWrites=true&w=majority');

const medicineSchema = new mongoose.Schema({
  name: String, genericName: String, manufacturer: String,
  price: Number, stock: Number, location: String, pharmacyId: String
});

const Medicine = mongoose.model('Medicine', medicineSchema);

const medicines = [
  // ==================== GENE THERAPY ====================
  { name: "Zolgensma", genericName: "Onasemnogene abeparvovec", manufacturer: "Novartis", price: 2125000, stock: 3, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Luxturna", genericName: "Voretigene neparvovec", manufacturer: "Spark Therapeutics", price: 850000, stock: 2, location: "Delhi", pharmacyId: "pharmacy2" },
  { name: "Hemgenix", genericName: "Etranacogene dezaparvovec", manufacturer: "CSL Behring", price: 3500000, stock: 1, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Elevidys", genericName: "Delandistrogene moxeparvovec", manufacturer: "Sarepta", price: 3200000, stock: 2, location: "Bangalore", pharmacyId: "pharmacy3" },
  { name: "Roctavian", genericName: "Valoctocogene roxaparvovec", manufacturer: "BioMarin", price: 2900000, stock: 1, location: "Hyderabad", pharmacyId: "pharmacy2" },
  
  // ==================== ENZYME REPLACEMENT ====================
  { name: "Lumizyme", genericName: "Alglucosidase alfa", manufacturer: "Sanofi", price: 125000, stock: 4, location: "Delhi", pharmacyId: "pharmacy2" },
  { name: "Naglazyme", genericName: "Galsulfase", manufacturer: "BioMarin", price: 98000, stock: 1, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Aldurazyme", genericName: "Laronidase", manufacturer: "Sanofi", price: 87500, stock: 2, location: "Chennai", pharmacyId: "pharmacy3" },
  { name: "Elaprase", genericName: "Idursulfase", manufacturer: "Takeda", price: 110000, stock: 3, location: "Bangalore", pharmacyId: "pharmacy2" },
  { name: "Vimizim", genericName: "Elosulfase alfa", manufacturer: "BioMarin", price: 95000, stock: 0, location: "Delhi", pharmacyId: "pharmacy3" },
  { name: "Brineura", genericName: "Cerliponase alfa", manufacturer: "BioMarin", price: 730000, stock: 2, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Fabrazyme", genericName: "Agalsidase beta", manufacturer: "Sanofi", price: 120000, stock: 5, location: "Kolkata", pharmacyId: "pharmacy1" },
  { name: "Cerezyme", genericName: "Imiglucerase", manufacturer: "Sanofi", price: 100000, stock: 4, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Vpriv", genericName: "Velaglucerase alfa", manufacturer: "Takeda", price: 115000, stock: 3, location: "Delhi", pharmacyId: "pharmacy2" },
  
  // ==================== METABOLIC DISORDERS ====================
  { name: "Carbaglu", genericName: "Carglumic acid", manufacturer: "Recordati", price: 15000, stock: 2, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Cystagon", genericName: "Cysteamine bitartrate", manufacturer: "Mylan", price: 8500, stock: 0, location: "Bangalore", pharmacyId: "pharmacy2" },
  { name: "Myalept", genericName: "Metreleptin", manufacturer: "Aegerion", price: 42000, stock: 5, location: "Delhi", pharmacyId: "pharmacy1" },
  { name: "Brineura", genericName: "Cerliponase alfa", manufacturer: "BioMarin", price: 730000, stock: 2, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Naglazyme", genericName: "Galsulfase", manufacturer: "BioMarin", price: 98000, stock: 1, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Orfadin", genericName: "Nitisinone", manufacturer: "Sobi", price: 25000, stock: 3, location: "Chennai", pharmacyId: "pharmacy3" },
  { name: "Cystaran", genericName: "Cysteamine ophthalmic", manufacturer: "Recordati", price: 12000, stock: 2, location: "Hyderabad", pharmacyId: "pharmacy2" },
  
  // ==================== CANCER THERAPY ====================
  { name: "Kymriah", genericName: "Tisagenlecleucel", manufacturer: "Novartis", price: 4500000, stock: 1, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Yescarta", genericName: "Axicabtagene ciloleucel", manufacturer: "Gilead", price: 4200000, stock: 1, location: "Bangalore", pharmacyId: "pharmacy3" },
  { name: "Breyanzi", genericName: "Lisocabtagene maraleucel", manufacturer: "Bristol-Myers Squibb", price: 4100000, stock: 1, location: "Delhi", pharmacyId: "pharmacy2" },
  { name: "Tecartus", genericName: "Brexucabtagene autoleucel", manufacturer: "Gilead", price: 4300000, stock: 1, location: "Hyderabad", pharmacyId: "pharmacy1" },
  
  // ==================== SMA TREATMENT ====================
  { name: "Zolgensma", genericName: "Onasemnogene abeparvovec", manufacturer: "Novartis", price: 2125000, stock: 3, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Spinraza", genericName: "Nusinersen", manufacturer: "Biogen", price: 750000, stock: 2, location: "Mumbai", pharmacyId: "pharmacy1" },
  { name: "Evrysdi", genericName: "Risdiplam", manufacturer: "Roche", price: 800000, stock: 3, location: "Delhi", pharmacyId: "pharmacy2" }
];

const seed = async () => {
  await Medicine.deleteMany({});
  await Medicine.insertMany(medicines);
  console.log(`Added ${medicines.length} medicines to database!`);
  process.exit();
};

seed();