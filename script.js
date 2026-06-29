'use strict';

/* ============================================================
   ELITE DANGEROUS — Gestionnaire de Chantiers de Colonisation
   Persistance : IndexedDB
   ============================================================ */

// ============================================================
// DATABASE
// ============================================================

const DB_NAME    = 'EDColonisation';
const DB_VERSION = 1;
const STORE      = 'chantiers';
let db = null;

// ============================================================
// COMMODITIES — liste complète des ressources Elite Dangerous
// Source : commodity.csv (257 entrées)
// ============================================================

const COMMODITIES = [
  // Métaux
  { name: 'Platinum',                       name_fr: 'Platine',                                    category: 'Metals' },
  { name: 'Palladium',                      name_fr: 'Palladium',                                  category: 'Metals' },
  { name: 'Gold',                           name_fr: 'Or',                                         category: 'Metals' },
  { name: 'Silver',                         name_fr: 'Argent',                                     category: 'Metals' },
  { name: 'Cobalt',                         name_fr: 'Cobalt',                                     category: 'Metals' },
  { name: 'Beryllium',                      name_fr: 'Béryllium',                                  category: 'Metals' },
  { name: 'Indium',                         name_fr: 'Indium',                                     category: 'Metals' },
  { name: 'Gallium',                        name_fr: 'Gallium',                                    category: 'Metals' },
  { name: 'Tantalum',                       name_fr: 'Tantale',                                    category: 'Metals' },
  { name: 'Uranium',                        name_fr: 'Uranium',                                    category: 'Metals' },
  { name: 'Lithium',                        name_fr: 'Lithium',                                    category: 'Metals' },
  { name: 'Titanium',                       name_fr: 'Titane',                                     category: 'Metals' },
  { name: 'Copper',                         name_fr: 'Cuivre',                                     category: 'Metals' },
  { name: 'Aluminium',                      name_fr: 'Aluminium',                                  category: 'Metals' },
  { name: 'Hafnium 178',                    name_fr: 'Hafnium 178',                                category: 'Metals' },
  { name: 'Osmium',                         name_fr: 'Osmium',                                     category: 'Metals' },
  { name: 'Lanthanum',                      name_fr: 'Lanthane',                                   category: 'Metals' },
  { name: 'Thallium',                       name_fr: 'Thallium',                                   category: 'Metals' },
  { name: 'Bismuth',                        name_fr: 'Bismuth',                                    category: 'Metals' },
  { name: 'Thorium',                        name_fr: 'Thorium',                                    category: 'Metals' },
  { name: 'Praseodymium',                   name_fr: 'Praséodyme',                                 category: 'Metals' },
  { name: 'Samarium',                       name_fr: 'Samarium',                                   category: 'Metals' },
  { name: 'Steel',                          name_fr: 'Acier',                                      category: 'Metals' },
  // Minéraux
  { name: 'Bertrandite',                    name_fr: 'Bertrandite',                                category: 'Minerals' },
  { name: 'Indite',                         name_fr: 'Indite',                                     category: 'Minerals' },
  { name: 'Gallite',                        name_fr: 'Gallite',                                    category: 'Minerals' },
  { name: 'Coltan',                         name_fr: 'Coltan',                                     category: 'Minerals' },
  { name: 'Uraninite',                      name_fr: 'Uraninite',                                  category: 'Minerals' },
  { name: 'Lepidolite',                     name_fr: 'Lépidolite',                                 category: 'Minerals' },
  { name: 'Rutile',                         name_fr: 'Rutile',                                     category: 'Minerals' },
  { name: 'Bauxite',                        name_fr: 'Bauxite',                                    category: 'Minerals' },
  { name: 'Painite',                        name_fr: 'Painite',                                    category: 'Minerals' },
  { name: 'Cryolite',                       name_fr: 'Cryolithe',                                  category: 'Minerals' },
  { name: 'Goslarite',                      name_fr: 'Goslarite',                                  category: 'Minerals' },
  { name: 'Moissanite',                     name_fr: 'Moissanite',                                 category: 'Minerals' },
  { name: 'Pyrophyllite',                   name_fr: 'Pyrophyllite',                               category: 'Minerals' },
  { name: 'Taaffeite',                      name_fr: 'Taafféite',                                  category: 'Minerals' },
  { name: 'Jadeite',                        name_fr: 'Jadéite',                                    category: 'Minerals' },
  { name: 'Bromellite',                     name_fr: 'Bromellite',                                 category: 'Minerals' },
  { name: 'Low Temperature Diamonds',       name_fr: 'Diamants Basse Température',                category: 'Minerals' },
  { name: 'Methanol Monohydrate Crystals',  name_fr: 'Cristaux de Méthanol Monohydrate',          category: 'Minerals' },
  { name: 'Lithium Hydroxide',              name_fr: 'Hydroxyde de Lithium',                      category: 'Minerals' },
  { name: 'Methane Clathrate',              name_fr: 'Clathrate de Méthane',                      category: 'Minerals' },
  { name: 'Rhodplumsite',                   name_fr: 'Rhodplumsite',                               category: 'Minerals' },
  { name: 'Serendibite',                    name_fr: 'Sérendibite',                                category: 'Minerals' },
  { name: 'Monazite',                       name_fr: 'Monazite',                                   category: 'Minerals' },
  { name: 'Musgravite',                     name_fr: 'Musgravite',                                 category: 'Minerals' },
  { name: 'Benitoite',                      name_fr: 'Bénitoïte',                                  category: 'Minerals' },
  { name: 'Grandidierite',                  name_fr: 'Grandidiérite',                              category: 'Minerals' },
  { name: 'Alexandrite',                    name_fr: 'Alexandrite',                                category: 'Minerals' },
  { name: 'Void Opal',                      name_fr: 'Opale du Vide',                             category: 'Minerals' },
  { name: 'Haematite',                      name_fr: 'Hématite',                                   category: 'Minerals' },
  // Matériaux industriels
  { name: 'Polymers',                       name_fr: 'Polymères',                                  category: 'Industrial Materials' },
  { name: 'Semiconductors',                 name_fr: 'Semi-conducteurs',                          category: 'Industrial Materials' },
  { name: 'Superconductors',                name_fr: 'Supraconducteurs',                          category: 'Industrial Materials' },
  { name: 'Ceramic Composites',             name_fr: 'Composés en Céramiques',                     category: 'Industrial Materials' },
  { name: 'Meta-Alloys',                    name_fr: 'Méta-Alliages',                             category: 'Industrial Materials' },
  { name: 'Insulating Membrane',            name_fr: 'Membrane Isolante',                         category: 'Industrial Materials' },
  { name: 'CMM Composite',                  name_fr: 'Composite MMC',                             category: 'Industrial Materials' },
  { name: 'Micro-weave Cooling Hoses',      name_fr: 'Tuyaux de Refroidissement Micro-tissés',    category: 'Industrial Materials' },
  { name: 'Neofabric Insulation',           name_fr: 'Isolation Néofabrique',                     category: 'Industrial Materials' },
  // Produits chimiques
  { name: 'Water',                          name_fr: 'Eau',                                        category: 'Chemicals' },
  { name: 'Hydrogen Fuel',                  name_fr: 'Carburant Hydrogène',                       category: 'Chemicals' },
  { name: 'Mineral Oil',                    name_fr: 'Huile Minérale',                            category: 'Chemicals' },
  { name: 'Explosives',                     name_fr: 'Explosifs',                                  category: 'Chemicals' },
  { name: 'Pesticides',                     name_fr: 'Pesticides',                                 category: 'Chemicals' },
  { name: 'Synthetic Reagents',             name_fr: 'Réactifs Synthétiques',                     category: 'Chemicals' },
  { name: 'Nerve Agents',                   name_fr: 'Agents Neurotoxiques',                      category: 'Chemicals' },
  { name: 'Surface Stabilisers',            name_fr: 'Stabilisateurs de Surface',                 category: 'Chemicals' },
  { name: 'Hydrogen Peroxide',              name_fr: "Peroxyde d'Hydrogène",                      category: 'Chemicals' },
  { name: 'Liquid Oxygen',                  name_fr: 'Oxygène Liquide',                           category: 'Chemicals' },
  { name: 'Rockforth Fertiliser',           name_fr: 'Engrais Rockforth',                         category: 'Chemicals' },
  { name: 'Agronomic Treatment',            name_fr: 'Traitement Agronomique',                    category: 'Chemicals' },
  { name: 'Tritium',                        name_fr: 'Tritium',                                    category: 'Chemicals' },
  // Alimentation
  { name: 'Algae',                          name_fr: 'Algues',                                     category: 'Foods' },
  { name: 'Fruit and Vegetables',           name_fr: 'Fruits et Légumes',                         category: 'Foods' },
  { name: 'Grain',                          name_fr: 'Céréales',                                   category: 'Foods' },
  { name: 'Animal Meat',                    name_fr: 'Viande Animale',                            category: 'Foods' },
  { name: 'Fish',                           name_fr: 'Poisson',                                    category: 'Foods' },
  { name: 'Food Cartridges',                name_fr: 'Cartouches Alimentaires',                   category: 'Foods' },
  { name: 'Synthetic Meat',                 name_fr: 'Viande Synthétique',                        category: 'Foods' },
  { name: 'Tea',                            name_fr: 'Thé',                                        category: 'Foods' },
  { name: 'Coffee',                         name_fr: 'Café',                                       category: 'Foods' },
  // Textiles
  { name: 'Leather',                        name_fr: 'Cuir',                                       category: 'Textiles' },
  { name: 'Natural Fabrics',                name_fr: 'Tissus Naturels',                           category: 'Textiles' },
  { name: 'Synthetic Fabrics',              name_fr: 'Tissus Synthétiques',                       category: 'Textiles' },
  { name: 'Conductive Fabrics',             name_fr: 'Tissus Conducteurs',                        category: 'Textiles' },
  { name: 'Military Grade Fabrics',         name_fr: 'Tissus Grade Militaire',                    category: 'Textiles' },
  // Médicaments
  { name: 'Agri-Medicines',                 name_fr: 'Agri-Médicaments',                          category: 'Medicines' },
  { name: 'Performance Enhancers',          name_fr: 'Dopants de Performance',                    category: 'Medicines' },
  { name: 'Basic Medicines',                name_fr: 'Médicaments de Base',                       category: 'Medicines' },
  { name: 'Progenitor Cells',               name_fr: 'Cellules Progénitrices',                    category: 'Medicines' },
  { name: 'Combat Stabilisers',             name_fr: 'Stabilisateurs de Combat',                  category: 'Medicines' },
  { name: 'Advanced Medicines',             name_fr: 'Médicaments Avancés',                       category: 'Medicines' },
  // Drogues légales
  { name: 'Narcotics',                      name_fr: 'Narcotiques',                                category: 'Legal Drugs' },
  { name: 'Tobacco',                        name_fr: 'Tabac',                                      category: 'Legal Drugs' },
  { name: 'Beer',                           name_fr: 'Bière',                                      category: 'Legal Drugs' },
  { name: 'Wine',                           name_fr: 'Vin',                                        category: 'Legal Drugs' },
  { name: 'Liquor',                         name_fr: 'Alcool Fort',                               category: 'Legal Drugs' },
  { name: 'Bootleg Liquor',                 name_fr: 'Alcool de Contrebande',                     category: 'Legal Drugs' },
  { name: 'Onionhead Gamma Strain',         name_fr: 'Onionhead Souche Gamma',                    category: 'Legal Drugs' },
  // Machinerie
  { name: 'Power Generators',               name_fr: "Générateurs",                     category: 'Machinery' },
  { name: 'Water Purifiers',                name_fr: "Purificateurs d'Eau",                       category: 'Machinery' },
  { name: 'Microbial Furnaces',             name_fr: 'Fours Microbiens',                          category: 'Machinery' },
  { name: 'Mineral Extractors',             name_fr: 'Extracteurs Minéraux',                      category: 'Machinery' },
  { name: 'Crop Harvesters',                name_fr: 'Moissonneuses',                             category: 'Machinery' },
  { name: 'Marine Equipment',               name_fr: 'Équipement Marin',                          category: 'Machinery' },
  { name: 'Atmospheric Processors',         name_fr: 'Processeurs Atmosphériques',                category: 'Machinery' },
  { name: 'Geological Equipment',           name_fr: 'Équipement Géologique',                     category: 'Machinery' },
  { name: 'Thermal Cooling Units',          name_fr: 'Unités de Refroidissement Thermique',       category: 'Machinery' },
  { name: 'Building Fabricators',           name_fr: 'Fabricateurs de Construction',              category: 'Machinery' },
  { name: 'Skimmer Components',             name_fr: 'Composants de Skimmer',                     category: 'Machinery' },
  { name: 'Articulation Motors',            name_fr: "Moteurs d'Articulation",                    category: 'Machinery' },
  { name: 'HN Shock Mount',                 name_fr: 'Support Anti-choc HN',                      category: 'Machinery' },
  { name: 'Emergency Power Cells',          name_fr: "Cellules d'Énergie d'Urgence",              category: 'Machinery' },
  { name: 'Power Converter',                name_fr: "Convertisseur d'Énergie",                   category: 'Machinery' },
  { name: 'Energy Grid Assembly',           name_fr: 'Assemblage de Réseau Énergétique',          category: 'Machinery' },
  { name: 'Power Transfer Bus',             name_fr: "Bus de Transfert d'Énergie",                category: 'Machinery' },
  { name: 'Radiation Baffle',               name_fr: 'Déflecteur de Radiation',                   category: 'Machinery' },
  { name: 'Exhaust Manifold',               name_fr: "Collecteur d'Échappement",                  category: 'Machinery' },
  { name: 'Reinforced Mounting Plate',      name_fr: 'Platine de Fixation Renforcée',             category: 'Machinery' },
  { name: 'Heatsink Interlink',             name_fr: 'Interconnexion de Dissipateur Thermique',   category: 'Machinery' },
  { name: 'Magnetic Emitter Coil',          name_fr: "Bobine d'Émetteur Magnétique",              category: 'Machinery' },
  { name: 'Modular Terminals',              name_fr: 'Terminaux Modulaires',                      category: 'Machinery' },
  { name: 'Ion Distributor',                name_fr: "Distributeur d'Ions",                       category: 'Machinery' },
  // Technologie
  { name: 'Computer Components',            name_fr: 'Composants d\'ordinateur',                  category: 'Technology' },
  { name: 'H.E. Suits',                     name_fr: 'Combinaisons H.E.',                         category: 'Technology' },
  { name: 'Robotics',                       name_fr: 'Robotique',                                  category: 'Technology' },
  { name: 'Auto-Fabricators',               name_fr: 'Auto-Fabricateurs',                         category: 'Technology' },
  { name: 'Animal Monitors',                name_fr: 'Moniteurs Animaux',                         category: 'Technology' },
  { name: 'Aquaponic Systems',              name_fr: 'Systèmes Aquaponiques',                     category: 'Technology' },
  { name: 'Advanced Catalysers',            name_fr: 'Catalyseurs Avancés',                       category: 'Technology' },
  { name: 'Land Enrichment Systems',        name_fr: "Systèmes d'Enrichissement des Sols",        category: 'Technology' },
  { name: 'Resonating Separators',          name_fr: 'Séparateurs Résonnants',                    category: 'Technology' },
  { name: 'Bioreducing Lichen',             name_fr: 'Lichen Bioréducteur',                       category: 'Technology' },
  { name: 'Muon Imager',                    name_fr: 'Imageur à Muons',                           category: 'Technology' },
  { name: 'Structural Regulators',          name_fr: 'Régulateurs Structurels',                   category: 'Technology' },
  { name: 'Nanobreakers',                   name_fr: 'Nanodisjoncteurs',                          category: 'Technology' },
  { name: 'Telemetry Suite',                name_fr: 'Suite de Télémétrie',                       category: 'Technology' },
  { name: 'Micro Controllers',              name_fr: 'Microcontrôleurs',                          category: 'Technology' },
  { name: 'Hardware Diagnostic Sensor',     name_fr: 'Capteur de Diagnostic Matériel',            category: 'Technology' },
  { name: 'Medical Diagnostic Equipment',   name_fr: 'Équipement de Diagnostic Médical',          category: 'Technology' },
  // Armes
  { name: 'Personal Weapons',               name_fr: 'Armes Personnelles',                        category: 'Weapons' },
  { name: 'Battle Weapons',                 name_fr: 'Armes de Combat',                           category: 'Weapons' },
  { name: 'Reactive Armour',                name_fr: 'Armure Réactive',                           category: 'Weapons' },
  { name: 'Non-Lethal Weapons',             name_fr: 'Armes  incapacitantes',                         category: 'Weapons' },
  { name: 'Landmines',                      name_fr: 'Mines Terrestres',                          category: 'Weapons' },
  // Biens de consommation
  { name: 'Domestic Appliances',            name_fr: 'Appareils Ménagers',                        category: 'Consumer Items' },
  { name: 'Consumer Technology',            name_fr: 'Technologie Grand Public',                  category: 'Consumer Items' },
  { name: 'Clothing',                       name_fr: 'Vêtements',                                  category: 'Consumer Items' },
  { name: 'Trinkets of Hidden Fortune',     name_fr: 'Breloques de Fortune Cachée',               category: 'Consumer Items' },
  { name: 'Evacuation Shelter',             name_fr: "Abri d'Évacuation",                         category: 'Consumer Items' },
  { name: 'Survival Equipment',             name_fr: 'Équipement de Survie',                      category: 'Consumer Items' },
  // Esclavage
  { name: 'Slaves',                         name_fr: 'Esclaves',                                   category: 'Slavery' },
  { name: 'Imperial Slaves',                name_fr: 'Esclaves Impériaux',                        category: 'Slavery' },
  // Déchets
  { name: 'Biowaste',                       name_fr: 'Biodéchets',                                 category: 'Waste' },
  { name: 'Toxic Waste',                    name_fr: 'Déchets Toxiques',                          category: 'Waste' },
  { name: 'Chemical Waste',                 name_fr: 'Déchets Chimiques',                         category: 'Waste' },
  { name: 'Scrap',                          name_fr: 'Ferraille',                                  category: 'Waste' },
  // Non commercialisable
  { name: 'Limpets',                        name_fr: 'Limpets',                                    category: 'NonMarketable' },
  // Récupération
  { name: 'Black Box',                      name_fr: 'Boîte Noire',                               category: 'Salvage' },
  { name: 'Trade Data',                     name_fr: 'Données Commerciales',                      category: 'Salvage' },
  { name: 'Military Plans',                 name_fr: 'Plans Militaires',                          category: 'Salvage' },
  { name: 'Ancient Artefact',               name_fr: 'Artefact Ancien',                           category: 'Salvage' },
  { name: 'Rare Artwork',                   name_fr: "Œuvre d'Art Rare",                          category: 'Salvage' },
  { name: 'Experimental Chemicals',         name_fr: 'Produits Chimiques Expérimentaux',          category: 'Salvage' },
  { name: 'Rebel Transmissions',            name_fr: 'Transmissions Rebelles',                    category: 'Salvage' },
  { name: 'Prototype Tech',                 name_fr: 'Technologie Prototype',                     category: 'Salvage' },
  { name: 'Technical Blueprints',           name_fr: 'Plans Techniques',                          category: 'Salvage' },
  { name: 'Thargoid Sensor',                name_fr: 'Capteur Thargoïde',                         category: 'Salvage' },
  { name: 'AI Relics',                      name_fr: 'Reliques IA',                               category: 'Salvage' },
  { name: 'Antiquities',                    name_fr: 'Antiquités',                                 category: 'Salvage' },
  { name: 'Military Intelligence',          name_fr: 'Renseignement Militaire',                   category: 'Salvage' },
  { name: 'SAP 8 Core Container',           name_fr: 'Conteneur Noyau SAP 8',                     category: 'Salvage' },
  { name: 'Wreckage Components',            name_fr: "Composants d'Épave",                        category: 'Salvage' },
  { name: 'Encrypted Data Storage',         name_fr: 'Stockage de Données Chiffrées',             category: 'Salvage' },
  { name: 'Occupied Escape Pod',            name_fr: 'Capsule de Secours Occupée',                category: 'Salvage' },
  { name: 'Personal Effects',               name_fr: 'Effets Personnels',                         category: 'Salvage' },
  { name: 'Commercial Samples',             name_fr: 'Échantillons Commerciaux',                  category: 'Salvage' },
  { name: 'Tactical Data',                  name_fr: 'Données Tactiques',                         category: 'Salvage' },
  { name: 'Assault Plans',                  name_fr: "Plans d'Assaut",                            category: 'Salvage' },
  { name: 'Encrypted Correspondence',       name_fr: 'Correspondance Chiffrée',                   category: 'Salvage' },
  { name: 'Diplomatic Bag',                 name_fr: 'Valise Diplomatique',                       category: 'Salvage' },
  { name: 'Scientific Research',            name_fr: 'Recherche Scientifique',                    category: 'Salvage' },
  { name: 'Scientific Samples',             name_fr: 'Échantillons Scientifiques',                category: 'Salvage' },
  { name: 'Political Prisoners',            name_fr: 'Prisonniers Politiques',                    category: 'Salvage' },
  { name: 'Hostages',                       name_fr: 'Otages',                                     category: 'Salvage' },
  { name: 'Large Survey Data Cache',        name_fr: "Grande Cache de Données d'Exploration",     category: 'Salvage' },
  { name: 'Small Survey Data Cache',        name_fr: "Petite Cache de Données d'Exploration",     category: 'Salvage' },
  { name: 'Antique Jewellery',              name_fr: 'Bijoux Anciens',                            category: 'Salvage' },
  { name: 'Precious Gems',                  name_fr: 'Pierres Précieuses',                        category: 'Salvage' },
  { name: 'Earth Relics',                   name_fr: 'Reliques Terriennes',                       category: 'Salvage' },
  { name: 'Gene Bank',                      name_fr: 'Banque de Gènes',                           category: 'Salvage' },
  { name: 'Time Capsule',                   name_fr: 'Capsule Temporelle',                        category: 'Salvage' },
  { name: 'Geological Samples',             name_fr: 'Échantillons Géologiques',                  category: 'Salvage' },
  { name: 'Unstable Data Core',             name_fr: 'Noyau de Données Instable',                 category: 'Salvage' },
  { name: 'Damaged Escape Pod',             name_fr: 'Capsule de Secours Endommagée',             category: 'Salvage' },
  { name: 'Data Core',                      name_fr: 'Noyau de Données',                          category: 'Salvage' },
  { name: 'Mysterious Idol',                name_fr: 'Idole Mystérieuse',                         category: 'Salvage' },
  { name: 'Prohibited Research Materials',  name_fr: 'Matériaux de Recherche Prohibés',           category: 'Salvage' },
  { name: 'Antimatter Containment Unit',    name_fr: 'Unité de Confinement Antimatière',          category: 'Salvage' },
  { name: 'Space Pioneer Relics',           name_fr: "Reliques des Pionniers de l'Espace",        category: 'Salvage' },
  { name: 'Fossil Remnants',                name_fr: 'Restes Fossiles',                           category: 'Salvage' },
  { name: 'Guardian Relic',                 name_fr: 'Relique Gardien',                           category: 'Salvage' },
  { name: 'Guardian Orb',                   name_fr: 'Orbe Gardien',                              category: 'Salvage' },
  { name: 'Guardian Casket',                name_fr: 'Coffret Gardien',                           category: 'Salvage' },
  { name: 'Guardian Tablet',                name_fr: 'Tablette Gardien',                          category: 'Salvage' },
  { name: 'Guardian Urn',                   name_fr: 'Urne Gardien',                              category: 'Salvage' },
  { name: 'Guardian Totem',                 name_fr: 'Totem Gardien',                             category: 'Salvage' },
  { name: 'Thargoid Probe',                 name_fr: 'Sonde Thargoïde',                           category: 'Salvage' },
  { name: 'Thargoid Resin',                 name_fr: 'Résine Thargoïde',                          category: 'Salvage' },
  { name: 'Thargoid Biological Matter',     name_fr: 'Matière Biologique Thargoïde',              category: 'Salvage' },
  { name: 'Thargoid Technology Samples',    name_fr: 'Échantillons Technologiques Thargoïdes',    category: 'Salvage' },
  { name: 'Thargoid Link',                  name_fr: 'Lien Thargoïde',                            category: 'Salvage' },
  { name: 'Thargoid Heart',                 name_fr: 'Cœur Thargoïde',                            category: 'Salvage' },
  { name: 'Thargoid Cyclops Tissue Sample', name_fr: 'Tissu Thargoïde — Cyclops',                category: 'Salvage' },
  { name: 'Thargoid Basilisk Tissue Sample',name_fr: 'Tissu Thargoïde — Basilisk',               category: 'Salvage' },
  { name: 'Thargoid Medusa Tissue Sample',  name_fr: 'Tissu Thargoïde — Medusa',                 category: 'Salvage' },
  { name: 'Thargoid Scout Tissue Sample',   name_fr: 'Tissu Thargoïde — Éclaireur',              category: 'Salvage' },
  { name: 'Ancient Key',                    name_fr: 'Clé Ancienne',                              category: 'Salvage' },
  { name: 'Thargoid Hydra Tissue Sample',   name_fr: 'Tissu Thargoïde — Hydra',                  category: 'Salvage' },
  { name: 'Mollusc Fluid',                  name_fr: 'Fluide de Mollusque',                       category: 'Salvage' },
  { name: 'Mollusc Soft Tissue',            name_fr: 'Tissu Mou de Mollusque',                    category: 'Salvage' },
  { name: 'Mollusc Brain Tissue',           name_fr: 'Tissu Cérébral de Mollusque',               category: 'Salvage' },
  { name: 'Pod Core Tissue',                name_fr: 'Tissu du Noyau de Gousse',                  category: 'Salvage' },
  { name: 'Pod Dead Tissue',                name_fr: 'Tissu Mort de Gousse',                      category: 'Salvage' },
  { name: 'Pod Surface Tissue',             name_fr: 'Tissu de Surface de Gousse',                category: 'Salvage' },
  { name: 'Anomaly Particles',              name_fr: "Particules d'Anomalie",                     category: 'Salvage' },
  { name: 'Pod Tissue',                     name_fr: 'Tissu de Gousse',                           category: 'Salvage' },
  { name: 'Mollusc Membrane',               name_fr: 'Membrane de Mollusque',                     category: 'Salvage' },
  { name: 'Mollusc Mycelium',               name_fr: 'Mycélium de Mollusque',                     category: 'Salvage' },
  { name: 'Mollusc Spores',                 name_fr: 'Spores de Mollusque',                       category: 'Salvage' },
  { name: 'Pod Mesoglea',                   name_fr: 'Mésoglée de Gousse',                        category: 'Salvage' },
  { name: 'Pod Outer Tissue',               name_fr: 'Tissu Externe de Gousse',                   category: 'Salvage' },
  { name: 'Pod Shell Tissue',               name_fr: 'Tissu de Coquille de Gousse',               category: 'Salvage' },
  { name: 'Unclassified Relic',             name_fr: 'Relique Non Classifiée',                    category: 'Salvage' },
  { name: 'Thargoid Orthrus Tissue Sample', name_fr: 'Tissu Thargoïde — Orthrus',                category: 'Salvage' },
  { name: 'Caustic Tissue Sample',          name_fr: 'Échantillon de Tissu Caustique',            category: 'Salvage' },
  { name: 'Unoccupied Escape Pod',          name_fr: 'Capsule de Secours Inoccupée',              category: 'Salvage' },
  { name: 'Thargoid Glaive Tissue Sample',  name_fr: 'Tissu Thargoïde — Glaive',                 category: 'Salvage' },
  { name: 'Thargoid Scythe Tissue Sample',  name_fr: 'Tissu Thargoïde — Faux',                   category: 'Salvage' },
  { name: 'Titan Deep Tissue Sample',       name_fr: 'Tissu Profond de Titan',                    category: 'Salvage' },
  { name: 'Titan Tissue Sample',            name_fr: 'Tissu de Titan',                            category: 'Salvage' },
  { name: 'Titan Partial Tissue Sample',    name_fr: 'Tissu Partiel de Titan',                    category: 'Salvage' },
  { name: 'Titan Maw Deep Tissue Sample',   name_fr: 'Tissu Profond — Mâchoires de Titan',       category: 'Salvage' },
  { name: 'Titan Maw Tissue Sample',        name_fr: 'Tissu — Mâchoires de Titan',               category: 'Salvage' },
  { name: 'Titan Maw Partial Tissue Sample',name_fr: 'Tissu Partiel — Mâchoires de Titan',       category: 'Salvage' },
  { name: 'Protective Membrane Scrap',      name_fr: 'Débris de Membrane Protectrice',            category: 'Salvage' },
  { name: 'Xenobiological Prison Pod',      name_fr: 'Capsule-Prison Xénobiologique',             category: 'Salvage' },
  { name: 'Coral Sap',                      name_fr: 'Sève de Corail',                            category: 'Salvage' },
  { name: 'Impure Spire Mineral',           name_fr: 'Minéral de Flèche Impur',                  category: 'Salvage' },
  { name: 'Semi-Refined Spire Mineral',     name_fr: 'Minéral de Flèche Semi-Raffiné',           category: 'Salvage' },
  { name: 'Titan Drive Component',          name_fr: 'Composant de Propulsion de Titan',          category: 'Salvage' },
  { name: 'Cyst Specimen',                  name_fr: 'Spécimen de Kyste',                         category: 'Salvage' },
  { name: 'Bone Fragments',                 name_fr: "Fragments d'Os",                            category: 'Salvage' },
  { name: 'Organ Sample',                   name_fr: "Échantillon d'Organe",                      category: 'Salvage' },
];


function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORE)) {
        d.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

function dbGetAll() {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function dbPut(chantier) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).put(chantier);
    req.onsuccess = () => {
      // Assign generated id when inserting for the first time
      if (!chantier.id) chantier.id = req.result;
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

function dbDelete(id) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ============================================================
// APP STATE
// ============================================================

let chantiers    = [];   // Array of chantier objects from IndexedDB
let activeIdx    = null; // Index of the active tab
let shipCapacity = 1216;
let currentLang  = localStorage.getItem('ed_lang') || 'fr'; // 'fr' | 'en'

/**
 * Volatile in-memory state for the "loading" workflow.
 * Not persisted — resets on page reload.
 * Format: { [resourceId]: { tempRemaining: number } }
 */
const loadingStates = {};

function getActive() {
  return (activeIdx !== null && chantiers[activeIdx]) ? chantiers[activeIdx] : null;
}

// ============================================================
// INITIALISATION
// ============================================================

async function init() {
  db         = await openDB();
  chantiers  = await dbGetAll();
  activeIdx  = chantiers.length > 0 ? 0 : null;

  shipCapacity = parseInt(localStorage.getItem('ed_shipCapacity') || '1216', 10);

  const capInput = document.getElementById('ship-capacity');
  capInput.value = shipCapacity;
  capInput.addEventListener('change', e => {
    shipCapacity = Math.max(1, parseInt(e.target.value, 10) || 1);
    e.target.value = shipCapacity;
    localStorage.setItem('ed_shipCapacity', shipCapacity);
  });

  document.getElementById('btn-new-chantier').addEventListener('click', createChantier);

  // Toggle de langue
  applyLang(currentLang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== currentLang) setLang(btn.dataset.lang);
    });
  });

  render();
}

// ============================================================
// RENDER — TABS
// ============================================================

function renderTabs() {
  const list = document.getElementById('tabs-list');
  list.innerHTML = '';

  chantiers.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === activeIdx ? ' active' : '');
    btn.title     = c.name;
    btn.textContent = c.name;
    btn.addEventListener('click', () => {
      activeIdx = i;
      render();
    });
    list.appendChild(btn);
  });
}

// ============================================================
// RENDER — CONTENT
// ============================================================

function renderContent() {
  const area = document.getElementById('tab-content-area');
  area.innerHTML = '';

  const chantier = getActive();
  if (!chantier) {
    area.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◈</div>
        <p>AUCUN CHANTIER ACTIF</p>
        <p class="empty-sub">Cliquez sur <strong>+ NOUVEAU CHANTIER</strong> pour commencer.</p>
      </div>`;
    return;
  }

  area.appendChild(buildChantierPanel(chantier));
}

function render() {
  renderTabs();
  renderContent();
}

// ============================================================
// BUILD CHANTIER PANEL
// ============================================================

function buildChantierPanel(chantier) {
  const panel = document.createElement('div');
  panel.className = 'chantier-panel';

  panel.innerHTML = `
    <!-- Header : nom + stats globales -->
    <div class="panel-header">
      <div class="panel-name-section">
        <label class="field-label">DÉSIGNATION DU CHANTIER</label>
        <input type="text" class="chantier-name-input" value="${esc(chantier.name)}" placeholder="Nom du chantier">
      </div>
      <div class="panel-stats" id="panel-stats-${chantier.id}">
        ${buildStatsHTML(chantier)}
      </div>
    </div>

    <!-- Actions globales du chantier -->
    <div class="panel-actions">
      <button class="btn btn-export">⬇ EXPORTER JSON</button>
      <label class="btn btn-import">
        ⬆ IMPORTER JSON
        <input type="file" accept=".json" style="display:none" class="js-import-input">
      </label>
      <button class="btn btn-danger btn-delete-chantier">✕ SUPPRIMER CE CHANTIER</button>
    </div>

    <!-- Ajouter une ressource -->
    <div class="panel-section">
      <div class="section-title">AJOUTER UNE RESSOURCE</div>
      <div class="add-resource-form">
        <div class="autocomplete-wrapper">
          <input type="text" class="form-input js-res-name" placeholder="Nom de la ressource (ex : Acier)" autocomplete="off">
        </div>
        <input type="number" class="form-input input-qty js-res-qty" placeholder="Quantité totale" min="1">
        <button class="btn btn-primary js-btn-add">+ AJOUTER</button>
      </div>
    </div>

    <!-- Liste des ressources -->
    <div class="panel-section">
      <div class="section-title">LISTE DES RESSOURCES</div>
      <div class="table-wrapper">
        <table class="resources-table">
          <thead>
            <tr>
              <th>RESSOURCE</th>
              <th class="th-right">TOTAL</th>
              <th class="th-right">RESTANT</th>
              <th>PROGRESSION</th>
              <th class="th-center">STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody class="js-resources-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  // ---- Bindings ----

  // Renommer le chantier
  panel.querySelector('.chantier-name-input').addEventListener('change', async e => {
    chantier.name = e.target.value.trim() || 'Chantier sans nom';
    e.target.value = chantier.name;
    await dbPut(chantier);
    renderTabs();
  });

  // Export
  panel.querySelector('.btn-export').addEventListener('click', () => exportChantier(chantier));

  // Import
  panel.querySelector('.js-import-input').addEventListener('change', e => {
    importChantierFile(e.target.files[0]);
    e.target.value = '';
  });

  // Supprimer chantier
  panel.querySelector('.btn-delete-chantier').addEventListener('click', () => deleteChantier(chantier.id));

  // Ajouter une ressource
  const nameIn = panel.querySelector('.js-res-name');
  const qtyIn  = panel.querySelector('.js-res-qty');
  const addBtn = panel.querySelector('.js-btn-add');

  attachAutocomplete(nameIn, qtyIn);

  addBtn.addEventListener('click', async () => {
    const name = nameIn.value.trim();
    const qty  = parseInt(qtyIn.value, 10);
    if (!name)       { flash(nameIn); return; }
    if (!qty || qty < 1) { flash(qtyIn);  return; }

    chantier.resources.push({
      id:                crypto.randomUUID(),
      name,
      totalQuantity:     qty,
      remainingQuantity: qty,
    });

    await dbPut(chantier);
    nameIn.value = '';
    qtyIn.value  = '';
    nameIn.focus();

    rebuildResourceRows(chantier, panel);
    refreshStats(chantier, panel);
    showToast('Ressource ajoutée.', 'info');
  });

  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') qtyIn.focus(); });
  qtyIn.addEventListener('keydown',  e => { if (e.key === 'Enter') addBtn.click(); });

  // Remplir le tableau
  rebuildResourceRows(chantier, panel);

  return panel;
}

// ============================================================
// STATS HTML
// ============================================================

function buildStatsHTML(chantier) {
  const total     = chantier.resources.length;
  const done      = chantier.resources.filter(r => r.remainingQuantity === 0).length;
  const totalQty  = chantier.resources.reduce((s, r) => s + r.totalQuantity, 0);
  const remaining = chantier.resources.reduce((s, r) => s + r.remainingQuantity, 0);
  const pct       = totalQty > 0 ? Math.round((totalQty - remaining) / totalQty * 100) : 0;

  return `
    <div class="stat-block">
      <span class="stat-label">RESSOURCES</span>
      <span class="stat-value">${done}/${total}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">PROGRESSION GLOBALE</span>
      <span class="stat-value">${pct}%</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">UNITÉS RESTANTES</span>
      <span class="stat-value">${remaining.toLocaleString('fr-FR')}</span>
    </div>
  `;
}

function refreshStats(chantier, panel) {
  const statsEl = panel.querySelector(`#panel-stats-${chantier.id}`);
  if (statsEl) statsEl.innerHTML = buildStatsHTML(chantier);
}

// ============================================================
// BUILD RESOURCE ROWS
// ============================================================

function rebuildResourceRows(chantier, panel) {
  const tbody = panel.querySelector('.js-resources-tbody');
  tbody.innerHTML = '';

  if (chantier.resources.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'empty-table-row';
    tr.innerHTML = '<td colspan="6">Aucune ressource ajoutée pour ce chantier.</td>';
    tbody.appendChild(tr);
    return;
  }

  chantier.resources.forEach(resource => {
    tbody.appendChild(buildResourceRow(resource, chantier, panel));
  });
}

function buildResourceRow(resource, chantier, panel) {
  const tr = document.createElement('tr');
  tr.dataset.rid = resource.id;

  const isLoading = !!loadingStates[resource.id];
  const isDone    = resource.remainingQuantity === 0;

  // During loading, show provisional remaining
  const displayRemaining = isLoading
    ? loadingStates[resource.id].tempRemaining
    : resource.remainingQuantity;

  // Progress is always based on confirmed (persisted) quantity
  const pct = resource.totalQuantity > 0
    ? Math.round((resource.totalQuantity - resource.remainingQuantity) / resource.totalQuantity * 100)
    : 0;

  // Status badge
  let badgeHtml;
  if (isDone)          badgeHtml = '<span class="badge badge-done">COMPLÉTÉ</span>';
  else if (isLoading)  badgeHtml = '<span class="badge badge-loading">EN TRANSIT</span>';
  else                 badgeHtml = '<span class="badge badge-idle">EN ATTENTE</span>';

  // Action buttons
  let actionsHtml;
  if (isLoading) {
    actionsHtml = `
      <button class="btn btn-deliver js-btn-deliver">✓ LIVRÉ</button>
      <button class="btn btn-fail    js-btn-fail">✕ RATÉ</button>
    `;
  } else {
    actionsHtml = `
      <button class="btn btn-load js-btn-load" ${isDone ? 'disabled' : ''}>⬆ CHARGER</button>
      <button class="btn btn-delete-res js-btn-del-res" title="Supprimer la ressource">✕</button>
    `;
  }

  const remainingClass = isLoading ? 'is-provisional' : isDone ? 'is-done' : '';

  tr.innerHTML = `
    <td class="col-name">${esc(resource.name)}</td>
    <td class="col-num">${resource.totalQuantity.toLocaleString('fr-FR')}</td>
    <td class="col-num ${remainingClass}">${displayRemaining.toLocaleString('fr-FR')}</td>
    <td class="col-progress">
      <div class="prog-bar">
        <div class="prog-fill" style="width:${pct}%"></div>
        <span class="prog-label">${pct}%</span>
      </div>
    </td>
    <td class="col-status">${badgeHtml}</td>
    <td class="col-actions"><div class="action-group">${actionsHtml}</div></td>
  `;

  // ---- Bind action buttons ----

  if (isLoading) {
    // LIVRÉ — confirme la soustraction
    tr.querySelector('.js-btn-deliver').addEventListener('click', async () => {
      resource.remainingQuantity = loadingStates[resource.id].tempRemaining;
      delete loadingStates[resource.id];
      await dbPut(chantier);
      rebuildResourceRows(chantier, panel);
      refreshStats(chantier, panel);
      showToast('Livraison confirmée !', 'success');
    });

    // RATÉ — annule et restaure la quantité d'origine
    tr.querySelector('.js-btn-fail').addEventListener('click', () => {
      delete loadingStates[resource.id];
      rebuildResourceRows(chantier, panel);
      showToast('Livraison annulée.', 'danger');
    });

  } else {
    // CHARGER
    if (!isDone) {
      tr.querySelector('.js-btn-load').addEventListener('click', () => {
        const cap     = parseInt(document.getElementById('ship-capacity').value, 10) || 1216;
        const loadAmt = Math.min(cap, resource.remainingQuantity);
        loadingStates[resource.id] = {
          tempRemaining: resource.remainingQuantity - loadAmt,
        };
        rebuildResourceRows(chantier, panel);
        showToast(`Chargement de ${loadAmt.toLocaleString('fr-FR')} unités — en transit.`, 'info');
      });
    }

    // SUPPRIMER RESSOURCE
    tr.querySelector('.js-btn-del-res').addEventListener('click', async () => {
      if (!confirm(`Supprimer la ressource "${resource.name}" ?`)) return;
      delete loadingStates[resource.id];
      chantier.resources = chantier.resources.filter(r => r.id !== resource.id);
      await dbPut(chantier);
      rebuildResourceRows(chantier, panel);
      refreshStats(chantier, panel);
    });
  }

  return tr;
}

// ============================================================
// LANGUE
// ============================================================

/**
 * Applique visuellement la langue sans re-rendre toute l'UI.
 * Met à jour le toggle, les placeholders et la liste ouverte si besoin.
 */
function applyLang(lang) {
  // Boutons toggle
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Placeholder de tous les champs ressource déjà dans le DOM
  document.querySelectorAll('.js-res-name').forEach(input => {
    input.placeholder = lang === 'fr'
      ? 'Nom de la ressource (ex : Acier, Titane…)'
      : 'Resource name (e.g. Steel, Titanium…)';
  });
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ed_lang', lang);
  applyLang(lang);
  showToast(lang === 'fr' ? 'Langue : Français' : 'Language: English', 'info');
}

// ============================================================
// ACTIONS — CHANTIERS
// ============================================================

async function createChantier() {
  const chantier = {
    name:      `Chantier ${chantiers.length + 1}`,
    resources: [],
  };
  await dbPut(chantier); // assigns chantier.id
  chantiers.push(chantier);
  activeIdx = chantiers.length - 1;
  render();
  showToast('Nouveau chantier créé.', 'info');
}

async function deleteChantier(id) {
  if (!confirm('Supprimer ce chantier ? Cette action est irréversible.')) return;

  const idx = chantiers.findIndex(c => c.id === id);
  if (idx === -1) return;

  // Nettoyer les états en mémoire
  chantiers[idx].resources.forEach(r => delete loadingStates[r.id]);

  await dbDelete(id);
  chantiers.splice(idx, 1);

  if (activeIdx >= chantiers.length) activeIdx = chantiers.length - 1;
  if (chantiers.length === 0) activeIdx = null;

  render();
  showToast('Chantier supprimé.', 'danger');
}

// ============================================================
// EXPORT JSON
// ============================================================

function exportChantier(chantier) {
  const payload = {
    name:       chantier.name,
    exportedAt: new Date().toISOString(),
    resources:  chantier.resources.map(r => ({
      name:              r.name,
      totalQuantity:     r.totalQuantity,
      remainingQuantity: r.remainingQuantity,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${sanitizeFilename(chantier.name)}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Chantier exporté.', 'success');
}

// ============================================================
// IMPORT JSON
// ============================================================

async function importChantierFile(file) {
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (typeof data.name !== 'string' || !Array.isArray(data.resources)) {
      throw new Error('Structure JSON invalide (name + resources requis).');
    }

    const chantier = {
      name:      data.name,
      resources: data.resources.map(r => ({
        id:                crypto.randomUUID(),
        name:              String(r.name || 'Ressource'),
        totalQuantity:     Number(r.totalQuantity) || 0,
        remainingQuantity: Number(r.remainingQuantity ?? r.totalQuantity) || 0,
      })),
    };

    await dbPut(chantier);
    chantiers.push(chantier);
    activeIdx = chantiers.length - 1;
    render();
    showToast(`Chantier "${chantier.name}" importé.`, 'success');

  } catch (err) {
    showToast(`Erreur import : ${err.message}`, 'danger');
  }
}

// ============================================================
// TOAST UTILITY
// ============================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

// ============================================================
// MISC UTILITIES
// ============================================================

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeFilename(str) {
  return String(str).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'chantier';
}

/** Visual shake on invalid input */
function flash(el) {
  el.style.borderColor = 'var(--danger)';
  el.focus();
  setTimeout(() => (el.style.borderColor = ''), 1200);
}

// ============================================================
// AUTOCOMPLETE
// ============================================================

/**
 * Attache un dropdown de suggestion sur un champ texte.
 * @param {HTMLInputElement} inputEl  — l'input de nom de ressource
 * @param {HTMLInputElement} nextFocus — l'élément qui recevra le focus après sélection
 */
function attachAutocomplete(inputEl, nextFocus) {
  const wrapper = inputEl.closest('.autocomplete-wrapper');
  if (!wrapper) return;

  // Création du dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.hidden = true;
  wrapper.appendChild(dropdown);

  let selectedIdx = -1;
  let currentMatches = [];

  // ---- Nom à afficher selon la langue courante ----
  function getDisplayName(item) {
    return currentLang === 'fr' ? (item.name_fr || item.name) : item.name;
  }

  // ---- Filtrage : cherche en priorité dans la langue active, puis l'autre ----
  function getMatches(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    return COMMODITIES
      .filter(c => {
        const primary   = getDisplayName(c).toLowerCase();
        const secondary = (currentLang === 'fr' ? c.name : (c.name_fr || c.name)).toLowerCase();
        return primary.includes(q) || secondary.includes(q);
      })
      .slice(0, 12);
  }

  // ---- Affichage ----
  function showDropdown(matches) {
    currentMatches = matches;
    selectedIdx = -1;
    dropdown.innerHTML = '';

    if (!matches.length) {
      dropdown.hidden = true;
      return;
    }

    matches.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'ac-item';
      div.dataset.idx = i;

      const displayName = getDisplayName(item);

      div.innerHTML =
        `<span class="ac-name">${highlightMatch(displayName, inputEl.value)}</span>` +
        `<span class="ac-cat">${esc(item.category)}</span>`;

      div.addEventListener('mousedown', e => {
        e.preventDefault();
        selectItem(item);
      });

      dropdown.appendChild(div);
    });

    dropdown.hidden = false;
  }

  // ---- Sélection : insère le nom dans la langue active ----
  function selectItem(item) {
    inputEl.value = getDisplayName(item);
    dropdown.hidden = true;
    selectedIdx = -1;
    if (nextFocus) nextFocus.focus();
  }

  // ---- Surlignage de la correspondance ----
  function highlightMatch(displayName, query) {
    if (!query) return esc(displayName);
    const idx = displayName.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return esc(displayName);
    return (
      esc(displayName.slice(0, idx)) +
      '<mark class="ac-mark">' + esc(displayName.slice(idx, idx + query.length)) + '</mark>' +
      esc(displayName.slice(idx + query.length))
    );
  }

  // ---- Navigation clavier ----
  function setHighlight(idx) {
    const items = dropdown.querySelectorAll('.ac-item');
    items.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    if (idx >= 0) items[idx]?.scrollIntoView({ block: 'nearest' });
  }

  // ---- Événements ----
  inputEl.addEventListener('input', () => {
    showDropdown(getMatches(inputEl.value.trim()));
  });

  inputEl.addEventListener('focus', () => {
    const q = inputEl.value.trim();
    if (q) showDropdown(getMatches(q));
  });

  inputEl.addEventListener('keydown', e => {
    if (dropdown.hidden) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, currentMatches.length - 1);
      setHighlight(selectedIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, -1);
      setHighlight(selectedIdx);
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      e.stopPropagation();
      selectItem(currentMatches[selectedIdx]);
    } else if (e.key === 'Escape') {
      dropdown.hidden = true;
      selectedIdx = -1;
    }
  });

  inputEl.addEventListener('blur', () => {
    // Délai court pour laisser mousedown se déclencher avant la fermeture
    setTimeout(() => { dropdown.hidden = true; }, 160);
  });
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', init);
