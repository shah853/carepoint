const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const connectDB = require('./config/db');
const Product = require('./models/product');
const Category = require('./models/category');

const categoryNames = [
  'Pain Relief', 'Fever', 'Cold and Flu', 'Allergy', 'Antibiotics',
  'Vitamins', 'Digestive Health', 'Diabetes', 'Blood Pressure',
  'Skin Care', 'First Aid', 'Supplements', 'Eye Care', "Children's Medicines",
];

const products = [
  ['Paracetamol 500mg Tablets', 'Fever', 180, 120, 4.7], ['Ibuprofen 200mg Tablets', 'Pain Relief', 220, 90, 4.6], ['Naproxen 250mg Tablets', 'Pain Relief', 310, 70, 4.5], ['Diclofenac Gel 30g', 'Pain Relief', 275, 55, 4.4], ['Aspirin 75mg Tablets', 'Pain Relief', 160, 80, 4.3], ['Muscle Ease Balm 25g', 'Pain Relief', 195, 60, 4.2], ['Paracetamol Suspension 120ml', 'Children\'s Medicines', 210, 75, 4.6],
  ['Acetaminophen Extra Strength', 'Fever', 260, 65, 4.5], ['FeverCool Oral Suspension', 'Fever', 230, 70, 4.4], ['Thermo Relief Sachets', 'Fever', 340, 45, 4.2], ['Digital Fever Thermometer', 'First Aid', 850, 30, 4.7], ['Cooling Fever Patches', 'Fever', 290, 40, 4.1],
  ['Cough Calm Syrup 100ml', 'Cold and Flu', 280, 70, 4.5], ['Honey Lemon Lozenges', 'Cold and Flu', 150, 100, 4.3], ['Menthol Throat Drops', 'Cold and Flu', 130, 110, 4.2], ['Nasal Saline Spray', 'Cold and Flu', 240, 65, 4.6], ['Decongestant Tablets', 'Cold and Flu', 275, 50, 4.1], ['Steam Inhalation Rub', 'Cold and Flu', 190, 80, 4.4], ['Adult Cold Relief Capsules', 'Cold and Flu', 320, 60, 4.3],
  ['Cetirizine 10mg Tablets', 'Allergy', 175, 100, 4.6], ['Loratadine 10mg Tablets', 'Allergy', 240, 80, 4.5], ['Fexofenadine 120mg Tablets', 'Allergy', 390, 60, 4.4], ['Calamine Lotion 100ml', 'Allergy', 230, 55, 4.3], ['Anti-Itch Cream 20g', 'Allergy', 265, 45, 4.2], ['Allergy Eye Drops', 'Allergy', 310, 40, 4.5],
  ['Amoxicillin 500mg Capsules', 'Antibiotics', 420, 45, 4.5], ['Azithromycin 500mg Tablets', 'Antibiotics', 520, 35, 4.4], ['Cefixime 200mg Tablets', 'Antibiotics', 610, 30, 4.3], ['Metronidazole 400mg Tablets', 'Antibiotics', 260, 50, 4.2], ['Mupirocin Ointment 15g', 'Antibiotics', 360, 40, 4.6], ['Antiseptic Solution 100ml', 'First Aid', 180, 85, 4.4],
  ['Vitamin C 500mg Tablets', 'Vitamins', 320, 100, 4.7], ['Vitamin D3 1000IU Capsules', 'Vitamins', 450, 90, 4.6], ['Vitamin B Complex Tablets', 'Vitamins', 390, 75, 4.5], ['Calcium Plus Tablets', 'Vitamins', 520, 65, 4.4], ['Iron Folic Acid Tablets', 'Vitamins', 285, 70, 4.3], ['Multivitamin Daily Tablets', 'Vitamins', 680, 80, 4.7], ['Zinc 20mg Tablets', 'Vitamins', 260, 85, 4.5],
  ['Antacid Chewable Tablets', 'Digestive Health', 160, 100, 4.3], ['Omeprazole 20mg Capsules', 'Digestive Health', 290, 75, 4.6], ['Oral Rehydration Salts', 'Digestive Health', 90, 150, 4.8], ['Probiotic Balance Capsules', 'Digestive Health', 720, 40, 4.5], ['Lactulose Solution 100ml', 'Digestive Health', 340, 50, 4.2], ['Digestive Enzyme Tablets', 'Digestive Health', 480, 55, 4.4], ['Isabgol Husk 100g', 'Digestive Health', 250, 70, 4.6],
  ['Metformin 500mg Tablets', 'Diabetes', 240, 80, 4.6], ['Glimepiride 2mg Tablets', 'Diabetes', 330, 50, 4.3], ['Blood Sugar Test Strips', 'Diabetes', 1250, 35, 4.7], ['Insulin Syringes Pack', 'Diabetes', 420, 60, 4.4], ['Glucose Monitoring Kit', 'Diabetes', 3200, 25, 4.8], ['Sugar-Free Nutrition Drink', 'Diabetes', 980, 35, 4.5],
  ['Amlodipine 5mg Tablets', 'Blood Pressure', 210, 75, 4.5], ['Losartan 50mg Tablets', 'Blood Pressure', 380, 55, 4.4], ['Atenolol 50mg Tablets', 'Blood Pressure', 260, 60, 4.3], ['Enalapril 10mg Tablets', 'Blood Pressure', 230, 50, 4.2], ['Automatic BP Monitor', 'Blood Pressure', 2850, 25, 4.7], ['Electrolyte Heart Support', 'Blood Pressure', 540, 40, 4.1],
  ['Aloe Vera Moisturizing Gel', 'Skin Care', 420, 65, 4.6], ['Hydrocortisone Cream 15g', 'Skin Care', 290, 45, 4.4], ['Gentle Antifungal Cream', 'Skin Care', 360, 50, 4.3], ['Moisture Repair Lotion', 'Skin Care', 650, 55, 4.5], ['Medicated Face Wash', 'Skin Care', 520, 45, 4.4], ['Sunscreen SPF 50 Lotion', 'Skin Care', 890, 40, 4.7], ['Healing Petroleum Jelly', 'Skin Care', 180, 90, 4.5],
  ['Adhesive Bandages Pack', 'First Aid', 120, 150, 4.6], ['Sterile Gauze Pads', 'First Aid', 230, 100, 4.5], ['Elastic Crepe Bandage', 'First Aid', 280, 65, 4.4], ['Medical Cotton Roll', 'First Aid', 190, 80, 4.3], ['Disposable Face Masks', 'First Aid', 350, 120, 4.6], ['Hand Sanitizer 250ml', 'First Aid', 260, 100, 4.5], ['First Aid Travel Kit', 'First Aid', 1450, 35, 4.7],
  ['Omega 3 Fish Oil Capsules', 'Supplements', 850, 60, 4.6], ['Magnesium Wellness Tablets', 'Supplements', 620, 50, 4.4], ['Collagen Beauty Powder', 'Supplements', 1350, 35, 4.5], ['Whey Protein Vanilla 500g', 'Supplements', 2450, 30, 4.7], ['Electrolyte Hydration Powder', 'Supplements', 780, 45, 4.3], ['Ashwagandha Wellness Capsules', 'Supplements', 920, 40, 4.2],
  ['Lubricating Eye Drops', 'Eye Care', 380, 60, 4.7], ['Allergy Relief Eye Drops', 'Eye Care', 420, 45, 4.5], ['Eye Wash Solution', 'Eye Care', 310, 50, 4.4], ['Blue Light Comfort Drops', 'Eye Care', 450, 35, 4.2], ['Reading Glasses +1.50', 'Eye Care', 550, 30, 4.3],
  ['Children\'s Cough Syrup 100ml', "Children's Medicines", 250, 70, 4.5], ['Children\'s Zinc Syrup 100ml', "Children's Medicines", 290, 65, 4.4], ['Baby Oral Rehydration', "Children's Medicines", 110, 120, 4.7], ['Children\'s Multivitamin Drops', "Children's Medicines", 520, 50, 4.6], ['Teething Relief Gel', "Children's Medicines", 275, 55, 4.3], ['Pediatric Nasal Drops', "Children's Medicines", 190, 60, 4.4],
  ['Paracetamol 650mg Caplets', 'Fever', 240, 110, 4.6], ['Naproxen Sodium 275mg Tablets', 'Pain Relief', 360, 65, 4.4], ['Lidocaine Pain Relief Spray', 'Pain Relief', 480, 35, 4.2], ['Guaifenesin Expectorant Syrup', 'Cold and Flu', 330, 60, 4.5], ['Dextromethorphan Cough Syrup', 'Cold and Flu', 310, 55, 4.3],
  ['Levocetirizine 5mg Tablets', 'Allergy', 210, 85, 4.6], ['Mometasone Nasal Spray', 'Allergy', 690, 30, 4.4], ['Clotrimazole Antifungal Cream', 'Skin Care', 295, 70, 4.5], ['Azelaic Acid Face Gel', 'Skin Care', 780, 25, 4.3], ['Benzoyl Peroxide Gel 5%', 'Skin Care', 430, 40, 4.4],
  ['Vitamin B12 Sublingual Tablets', 'Vitamins', 580, 60, 4.7], ['Folic Acid 5mg Tablets', 'Vitamins', 190, 100, 4.5], ['Calcium Vitamin D Tablets', 'Vitamins', 640, 70, 4.6], ['Magnesium Citrate Capsules', 'Supplements', 760, 45, 4.4], ['Coenzyme Q10 Capsules', 'Supplements', 1100, 30, 4.5],
  ['Pantoprazole 40mg Tablets', 'Digestive Health', 350, 80, 4.6], ['Domperidone 10mg Tablets', 'Digestive Health', 225, 65, 4.2], ['Fiber Supplement Sachets', 'Digestive Health', 540, 50, 4.5], ['Glucometer Test Strips 50 Pack', 'Diabetes', 1450, 35, 4.7], ['Digital Pulse Oximeter', 'First Aid', 1850, 25, 4.6],
];

const categoryImages = {
  'Pain Relief': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  Fever: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca9?auto=format&fit=crop&w=800&q=80',
  'Cold and Flu': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
  Allergy: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
  Antibiotics: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80',
  Vitamins: 'https://images.unsplash.com/photo-1616671276441-2f6c0f6f7f50?auto=format&fit=crop&w=800&q=80',
  'Digestive Health': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80',
  Diabetes: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80',
  'Blood Pressure': 'https://images.unsplash.com/photo-1638202993928-7d113b8c6f51?auto=format&fit=crop&w=800&q=80',
  'Skin Care': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80',
  'First Aid': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80',
  Supplements: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  'Eye Care': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  "Children's Medicines": 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
};

const productImage = (name, index) => {
  const backgrounds = ['ffffff', 'f0fdfa', 'eff6ff', 'fefce8', 'fff7ed', 'fdf2f8'];
  const accents = ['0f766e', '1d4ed8', 'b45309', 'be123c', '7c3aed', '047857'];
  const label = encodeURIComponent(`CarePoint Medicine - ${name}`);
  return `https://placehold.co/800x600/${backgrounds[index % backgrounds.length]}/${accents[index % accents.length]}?font=roboto&text=${label}`;
};

const seedProducts = async () => {
  await connectDB();
  let added = 0;
  let updated = 0;

  try {
    const categoryIds = {};
    for (const name of categoryNames) {
      const category = await Category.findOneAndUpdate(
        { name },
        { $setOnInsert: { name, image: categoryImages[name] } },
        { upsert: true, returnDocument: 'after' }
      );
      categoryIds[name] = category._id;
    }

    for (const [index, [name, category, price, stock, ratings]] of products.entries()) {
      const product = {
        name,
        description: `${name} for reliable everyday healthcare support. Use only as directed on the package or by a qualified healthcare professional.`,
        price,
        category: categoryIds[category],
        images: [productImage(name, index)],
        stock,
        ratings,
      };
      const result = await Product.updateOne(
        { name },
        { $set: product },
        { upsert: true }
      );
      if (result.upsertedCount) added += 1;
      else if (result.modifiedCount) updated += 1;
    }

    const total = await Product.countDocuments();
    console.log(`Products seed complete: ${added} added, ${updated} updated, ${total} total`);
  } catch (error) {
    console.error('Products seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
