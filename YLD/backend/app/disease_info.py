"""
Arecanut (Adike) Plant Disease Knowledge Base
Defines class names matching dataset indices 0-8 and rich agronomic details.
"""

CLASS_NAMES = [
    "Bud Borer",
    "Healthy Foot",
    "Healthy Leaf",
    "Healthy Nut",
    "Healthy Trunk",
    "Mahali Koleroga",
    "Stem Cracking",
    "Stem Bleeding",
    "Yellow Leaf Disease"
]

CLASS_FOLDER_MAP = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "bud borer": 0,
    "healthy_foot": 1,
    "Healthy_Leaf": 2,
    "Healthy_Nut": 3,
    "Healthy_Trunk": 4,
    "Mahali_Koleroga": 5,
    "stem cracking": 6,
    "Stem_bleeding": 7,
    "yellow leaf disease": 8
}

DISEASE_DETAILS = {
    0: {
        "name": "Bud Borer (Spindle Borer)",
        "scientific_name": "Carvalhoia arecae / Manatha albipes",
        "category": "Pest Infestation",
        "is_healthy": False,
        "description": "Bud and spindle borer caterpillars tunnel into the tender unopened spindle leaf and floral tissues, leading to chewed leaf margins, decayed spears, and shot-hole appearances.",
        "symptoms": [
            "Chewed and punched shot holes on emerging leaves",
            "Brown rotting and wilting of the central spindle",
            "Excreta (frass) visible near leaf axils and petiole bases",
            "Stunted emerging fronds with necrotic margins"
        ],
        "treatments": [
            "Apply neem cake to the root zone (2 kg per palm annually)",
            "Pour cartap hydrochloride or chlorantraniliprole solution into the inner leaf axils for severe infestations",
            "Place biological control agents like Trichogramma parasitoids"
        ],
        "prevention": [
            "Regular monitoring of young crown spindles",
            "Crown cleaning during pre-monsoon and post-monsoon maintenance",
            "Avoid excessive chemical spray that kills beneficial predator beetles"
        ]
    },
    1: {
        "name": "Healthy Foot / Base",
        "scientific_name": "Areca catechu",
        "category": "Healthy",
        "is_healthy": True,
        "description": "The basal region (foot) of the arecanut palm is intact, firm, and free from collar rot, foot rot (Ganoderma), termite infestation, or exudation.",
        "symptoms": [
            "Firm fibrous root attachments",
            "No basal resin exudation or spongy bark disintegration",
            "Healthy soil-bark transition zone"
        ],
        "treatments": [
            "No disease treatment needed",
            "Maintain optimal organic matter and mulching"
        ],
        "prevention": [
            "Avoid waterlogging around the root collar",
            "Apply Trichoderma-enriched compost annually"
        ]
    },
    2: {
        "name": "Healthy Leaf",
        "scientific_name": "Areca catechu",
        "category": "Healthy",
        "is_healthy": True,
        "description": "Vibrant, deep green, well-expanded fronds with normal photosynthetic function, free of chlorosis, necrosis, leaf spots, or fungal blights.",
        "symptoms": [
            "Uniform green pigmentation across pinnules",
            "Smooth leaf surface without lesions or necrotic margins",
            "Erect and robust crown structure"
        ],
        "treatments": [
            "Maintain balanced N-P-K (100:40:140 g per palm per year) fertilization",
            "Ensure regular irrigation during dry months"
        ],
        "prevention": [
            "Provide adequate spacing (2.7m x 2.7m) to prevent overcrowding",
            "Maintain micronutrient balance (Magnesium, Zinc, Boron)"
        ]
    },
    3: {
        "name": "Healthy Nut / Bunch",
        "scientific_name": "Areca catechu",
        "category": "Healthy",
        "is_healthy": True,
        "description": "Healthy arecanuts developing properly on inflorescence bunches, displaying smooth pericarp, uniform sizing, and absence of rot or premature shedding.",
        "symptoms": [
            "Well-set, plump green nuts firmly attached to stalks",
            "No water-soaked spots, felt mycelium, or gum tears",
            "Strong rachillae without dark lesions"
        ],
        "treatments": [
            "Ensure micronutrient sprays (Borax 0.2%) during flowering and nut set",
            "Maintain soil moisture during kernel filling stages"
        ],
        "prevention": [
            "Prophylactic Bordeaux mixture (1%) spray prior to onset of monsoon"
        ]
    },
    4: {
        "name": "Healthy Trunk / Stem",
        "scientific_name": "Areca catechu",
        "category": "Healthy",
        "is_healthy": True,
        "description": "A sturdy, straight, uniform stem with clearly defined nodal rings, free from longitudinal fissures, bleed lesions, or sun-scald cavities.",
        "symptoms": [
            "Uniform girth with smooth internodes",
            "No oozing rust-brown exudate or wood decay",
            "Strong structural resilience against wind loads"
        ],
        "treatments": [
            "Standard orchard management and weed clearance",
            "Whitewashing trunk with lime during hot summers if exposed to direct sun"
        ],
        "prevention": [
            "Prevent mechanical injury to the bark during inter-cultivation"
        ]
    },
    5: {
        "name": "Mahali / Koleroga (Fruit Rot)",
        "scientific_name": "Phytophthora meadii",
        "category": "Fungal Infection",
        "is_healthy": False,
        "description": "One of the most destructive diseases of Arecanut during the South-West monsoon. Causes water-soaked lesions, dark discoloration, white cottony fungal growth, and massive premature nut dropping.",
        "symptoms": [
            "Dark water-soaked lesions near the calyx of nuts",
            "Heavy premature shedding (dropping) of green and developing nuts",
            "White felt-like fungal mycelium covering fallen nuts",
            "Foul odor and rotting of bunch stalks and crown tissues"
        ],
        "treatments": [
            "Spray 1% Bordeaux mixture thoroughly covering bunches prior to monsoon rains",
            "Second spray with Bordeaux mixture (1%) or Copper Oxychloride 45 days after the first spray",
            "In severe cases, spray Metalaxyl-Mancozeb (2g/L) on affected bunches",
            "Cover bunches with polythene covers (biodegradable) before monsoon onset"
        ],
        "prevention": [
            "Collect and destroy all fallen diseased nuts and rotting stalks",
            "Ensure clean drainage to avoid excessive humid microclimates",
            "Tie polythene covers over bunches in high-rainfall zones"
        ]
    },
    6: {
        "name": "Stem Cracking (Sun Scorch & Fissures)",
        "scientific_name": "Abiotic Stress / Secondary Botryodiplodia",
        "category": "Physiological & Secondary Pathogen",
        "is_healthy": False,
        "description": "Severe longitudinal splits and fissures develop along the trunk due to sudden thermal shock, intense sun exposure on southern/south-western exposures, or irregular water management.",
        "symptoms": [
            "Long vertical cracks and splits on the trunk bark",
            "Internal tissue exposure leading to secondary rot and weakness",
            "Stunted foliage growth above cracked sections"
        ],
        "treatments": [
            "Apply Bordeaux paste (10%) or copper fungicide inside and over the cracks",
            "Bandage deep cracks with coir wrapping and clay-cowdung-fungicide paste",
            "Ensure regular irrigation schedule to prevent moisture stress cycles"
        ],
        "prevention": [
            "Whitewash trunks with lime (slaked lime 20%) on south/west facing borders",
            "Plant shade trees or green border belts to shield from direct afternoon sun",
            "Avoid deep tillage close to base to prevent root damage"
        ]
    },
    7: {
        "name": "Stem Bleeding",
        "scientific_name": "Thielaviopsis paradoxa (Ceratocystis paradoxa)",
        "category": "Fungal Infection",
        "is_healthy": False,
        "description": "A serious fungal disorder characterized by dark reddish-brown to black gummy exudation trickling down from trunk cracks, causing internal wood rotting and cavitation.",
        "symptoms": [
            "Exudation of dark rusty brown or black viscous fluid from trunk crevices",
            "Fluid turns blackish upon drying on the trunk surface",
            "Internal vascular discoloration and hollow cavities under the bark",
            "Gradual reduction in crown size and nut yield"
        ],
        "treatments": [
            "Chisel out infected dark fibrous tissues with a sharp tool until healthy wood is exposed",
            "Drench and paint the wound with Coal Tar / Bordeaux Paste or Tridemorph / Hexaconazole (5ml/L)",
            "Root feeding with Hexaconazole (2ml in 100ml water) or Calixin (3ml in 100ml water)"
        ],
        "prevention": [
            "Avoid any mechanical wounding to the trunk",
            "Apply organic neem cake and Trichoderma viride to the soil around the palm",
            "Ensure good orchard drainage and avoid severe moisture stress"
        ]
    },
    8: {
        "name": "Yellow Leaf Disease (YLD)",
        "scientific_name": "Phytoplasma (16SrXI group) / Transmitted by Proutista moesta",
        "category": "Phytoplasma / Complex Etiology",
        "is_healthy": False,
        "description": "A devastating systemic phytoplasma disease transmitted by plant hoppers. Causes characteristic golden yellowing of inner fronds, necrosis of tips, brittle leaves, and kernel rot.",
        "symptoms": [
            "Distinct yellowing starting from the tips of leaflets in the middle whorl fronds",
            "Yellowing advances inward with brown necrotic tips ('burnt' appearance)",
            "Leaflets become brittle, narrow, and crinkled",
            "Nuts become dark, spongy, soft with internal black rot (Chali deterioration)",
            "Severe reduction in yield and gradual palm decline"
        ],
        "treatments": [
            "No single chemical cure for systemic phytoplasma; manage through systemic rejuvenation:",
            "Apply balanced nutrients: 150g N, 60g P2O5, 210g K2O + 1kg Dolomite (Magnesium source) per palm/year",
            "Spray micro-nutrients (Zinc sulphate 0.5%, Borax 0.2%, Magnesium sulphate 1%)",
            "Vector control: Spray Dimethoate (1.5ml/L) or Neem oil (5ml/L) to control plant hopper vectors (Proutista moesta)",
            "Adopt intercropping with cocoa, banana, and pepper to improve micro-environment and farm returns"
        ],
        "prevention": [
            "Plant resistant/tolerant arecanut cultivars (e.g., South Kanara local selections / Mangala)",
            "Ensure adequate root-zone drainage and organic mulching",
            "Promptly eradicate terminally declining diseased palms"
        ]
    }
}
