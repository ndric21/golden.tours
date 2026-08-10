-- Golden Tours seed data
-- Real catalog content only — East Africa's national parks and tourism
-- centers (destinations) and platform-curated trip packages, every image
-- verified to actually resolve. No demo/fake user accounts, bookings,
-- payments or reviews are seeded: every account, booking, payment and
-- review in this app is created for real by real people signing up and
-- using the platform, backed by real Supabase Auth + Postgres.

-- ============================================================
-- DESTINATIONS (25 — East Africa's national parks & tourism centers)
-- ============================================================
insert into public.destinations (id, slug, name, tag, category, rating, image, images, description, highlights, country) values

('30000000-0000-0000-0000-000000000001', 'zanzibar', 'Zanzibar', 'Tropical Paradise', 'Beach', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/0/04/White_sandy_beach_at_Nungwi%2C_Zanzibar.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/0/04/White_sandy_beach_at_Nungwi%2C_Zanzibar.jpg','https://upload.wikimedia.org/wikipedia/commons/4/4c/Dhow_Sunset%2C_Zanzibar_%2810164046475%29.jpg'],
 'Zanzibar is a breathtaking archipelago off the coast of East Africa, known for its pristine, white-sand beaches, crystal-clear turquoise waters, and rich cultural heritage. Explore the historic alleys of Stone Town, a UNESCO World Heritage site, dive into vibrant coral reefs, or simply relax under swaying palm trees. The island offers an intoxicating mix of Swahili, Arab, and Indian influences, visible in its architecture, cuisine, and the famous Spice Tours.',
 array['Stone Town UNESCO Site','Spice Farm Tours','Nungwi & Kendwa Beaches','Snorkeling at Mnemba Atoll'], 'Tanzania'),

('30000000-0000-0000-0000-000000000002', 'serengeti', 'Serengeti N.P.', 'The Great Migration', 'Safari', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Wildebeest_migration_%287513594286%29.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/0/0d/Wildebeest_migration_%287513594286%29.jpg','https://upload.wikimedia.org/wikipedia/commons/6/64/Wildebeest_on_the_Great_Migration_in_the_northern_Serengeti_%284%29_%2828630075195%29.jpg'],
 'The Serengeti National Park is globally renowned for its vast, open plains and the greatest wildlife spectacle on earth: the Great Migration. Millions of wildebeest, zebras, and gazelles traverse this ancient ecosystem annually. It boasts the highest concentration of large predators in the world, making it the ultimate destination for thrilling, action-packed safaris. Sunsets here cast a golden glow across the savannah, creating postcard-perfect memories.',
 array['The Great Wildebeest Migration','Exceptional Big Cat Sightings','Hot Air Balloon Safaris','Vast Endless Plains'], 'Tanzania'),

('30000000-0000-0000-0000-000000000003', 'maasai-mara', 'Maasai Mara', 'Wildlife Spectacle', 'Safari', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/8/85/Safari_vehicles_watching_lion_couple_in_Maasai_Mara%2C_Kenya.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/8/85/Safari_vehicles_watching_lion_couple_in_Maasai_Mara%2C_Kenya.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b8/Safari_in_The_Maasai_Mara_%2843837384641%29.jpg'],
 'The Maasai Mara National Reserve is Kenya''s premier wildlife park and a northern extension of the Serengeti. It is celebrated for its exceptional populations of lions, leopards, cheetahs, and African bush elephants. The Mara is also the stage for the dramatic river crossings during the Great Migration (July to October). Rich in Maasai culture, visitors can experience authentic cultural encounters alongside unparalleled wildlife viewing.',
 array['Mara River Crossings','Big Five Spotting','Maasai Village Visits','Year-round Game Viewing'], 'Kenya'),

('30000000-0000-0000-0000-000000000004', 'diani', 'Diani Beach', 'Coastal Elegance', 'Beach', 4.8,
 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Diani_Beach%2C_Kenya_-_panoramio.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/8/8d/Diani_Beach%2C_Kenya_-_panoramio.jpg','https://upload.wikimedia.org/wikipedia/commons/c/c5/Diani_Beach_overlooking_the_Indian_Ocean.jpg'],
 'Frequently voted as one of Africa''s leading beach destinations, Diani Beach is a stunning 17-kilometer stretch of flawless white sand bordered by the lush coastal forest and the warm Indian Ocean. It''s a paradise for water sports enthusiasts, offering world-class kitesurfing, deep-sea fishing, and diving. The offshore coral reefs provide a safe, calm lagoon, perfect for swimming and snorkeling.',
 array['World-class Kitesurfing','Coral Reef Snorkeling','Luxury Boutique Resorts','Colobus Conservation Center'], 'Kenya'),

('30000000-0000-0000-0000-000000000005', 'bwindi', 'Bwindi Forest', 'Gorilla Trekking', 'Forest', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/3/38/Mountain_gorilla%2C_2-year-old%2C_Mubare_Group%2C_Buhoma%2C_Bwindi_Impenetrable_Forest%2C_Uganda.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/3/38/Mountain_gorilla%2C_2-year-old%2C_Mubare_Group%2C_Buhoma%2C_Bwindi_Impenetrable_Forest%2C_Uganda.jpg','https://upload.wikimedia.org/wikipedia/commons/2/2f/Gorila_de_monta%C3%B1a_%28Gorilla_beringei_beringei%29%2C_parque_nacional_de_la_Selva_Impenetrable_de_Bwindi%2C_Uganda%2C_2024-02-02%2C_DD_51.jpg'],
 'Bwindi Impenetrable National Park is a mystical, mist-covered rainforest that dates back over 25,000 years. As a UNESCO World Heritage site, it is most famous for harboring almost half of the world''s remaining endangered mountain gorillas. Trekking through the dense jungle to spend a magical hour with a silverback and his family is considered one of the most profound and emotional wildlife encounters on the planet.',
 array['Mountain Gorilla Trekking','Rich Biodiversity','Bird Watching (350+ species)','Batwa Cultural Experience'], 'Uganda'),

('30000000-0000-0000-0000-000000000006', 'kilimanjaro', 'Mt. Kilimanjaro', 'Roof of Africa', 'Mountain', 4.8,
 'https://upload.wikimedia.org/wikipedia/commons/2/23/The_view_of_mountain_Kilimanjaro_from_Moshi_town_in_Tanzania.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/2/23/The_view_of_mountain_Kilimanjaro_from_Moshi_town_in_Tanzania.jpg','https://upload.wikimedia.org/wikipedia/commons/1/1c/Kilimanjaro_viewed_from_Moshi.jpg'],
 'Mount Kilimanjaro is the highest peak in Africa and the tallest free-standing mountain in the world. Rising majestically from the surrounding plains, its snow-capped summit is a beacon for trekkers globally. The journey to the top takes you through five distinct climate zones, from dense rainforest to alpine desert and finally the glacial arctic summit. It is a challenging but intensely rewarding bucket-list adventure.',
 array['Summiting Uhuru Peak','Diverse Ecological Zones','Multiple Trekking Routes','Breathtaking Sunrises'], 'Tanzania'),

('30000000-0000-0000-0000-000000000007', 'ngorongoro', 'Ngorongoro Crater', 'Wildlife Eden', 'Crater', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Ngorongoro_crater%2C_Tanzania_.01.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Ngorongoro_crater%2C_Tanzania_.01.jpg','https://upload.wikimedia.org/wikipedia/commons/1/10/Zebras_Ngorongoro_Crater.jpg'],
 'Often referred to as the ''Eighth Wonder of the World'', the Ngorongoro Crater is the world''s largest unbroken, unflooded volcanic caldera. It acts as a natural enclosure for a staggering abundance of wildlife, including the dense population of lions and the endangered black rhino. The crater floor combines grasslands, swamps, and a soda lake, offering some of the most reliable and concentrated game viewing in Africa.',
 array['Highest Density of Lions','Endangered Black Rhinos','Spectacular Caldera Views','Lerai Fever Tree Forest'], 'Tanzania'),

('30000000-0000-0000-0000-000000000008', 'lamu', 'Lamu Island', 'Ancient Swahili Charm', 'Island', 4.7,
 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=800&q=80',
 array['https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80'],
 'Lamu Old Town is the oldest and best-preserved Swahili settlement in East Africa. Time slows down on this peaceful island where there are no cars — only donkeys and traditional dhows sailing the channels. Lamu is characterized by its narrow, winding streets, intricately carved wooden doors, and coral stone buildings. It offers a deeply authentic cultural experience paired with tranquil, empty beaches at Shela.',
 array['Car-free Historic Town','Traditional Dhow Sailing','Swahili Architecture','Pristine Shela Beach'], 'Kenya'),

('30000000-0000-0000-0000-000000000009', 'nakuru', 'Lake Nakuru', 'Flamingo Haven', 'Park', 4.6,
 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flamingos_in_Lake_Nakuru.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/0/0f/Flamingos_in_Lake_Nakuru.jpg','https://upload.wikimedia.org/wikipedia/commons/7/70/Lake_Nakuru_National_Park_02_-_Lesser_Flamingo_%28Phoeniconaias_minor%29.jpg'],
 'Nestled in the Great Rift Valley, Lake Nakuru National Park is famous for its vast flocks of vibrant pink flamingos that gather in the alkaline lake''s shallow waters. Beyond the birds, it is a highly successful sanctuary for both black and white rhinos. The park features picturesque landscapes ranging from marshlands and acacia woodlands to rocky cliffs, providing excellent game drives.',
 array['Flamingo Flocks','Rhino Sanctuary','Rothschild''s Giraffes','Baboon Cliff Viewpoint'], 'Kenya'),

('30000000-0000-0000-0000-000000000010', 'ruaha', 'Ruaha N.P.', 'Untamed Wilderness', 'Safari', 4.8,
 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
 array['https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=800&q=80'],
 'Ruaha National Park is Tanzania''s best-kept secret. As the largest national park in the country, it offers an incredibly raw, uncrowded, and wild safari experience. It is famous for its massive elephant herds, large prides of lions, and the endangered African wild dog. The Great Ruaha River is the lifeblood of the park, drawing incredible congregations of wildlife during the dry season.',
 array['Huge Elephant Herds','Off-the-beaten-path Safari','African Wild Dogs','Walking Safaris'], 'Tanzania'),

('30000000-0000-0000-0000-000000000011', 'mt-kenya', 'Mount Kenya', 'Rugged Beauty', 'Mountain', 4.7,
 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
 array['https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80','https://upload.wikimedia.org/wikipedia/commons/1/1c/Kilimanjaro_viewed_from_Moshi.jpg','https://images.unsplash.com/photo-1589182337358-2cb63099350c?auto=format&fit=crop&w=800&q=80'],
 'Mount Kenya is the second-highest peak in Africa and a UNESCO World Heritage site. Unlike Kilimanjaro, Mount Kenya offers a more rugged, alpine climbing experience with dramatic glacier-clad peaks, pristine tarns, and dense bamboo forests. It is an adventurer''s paradise, providing challenging technical climbs and incredibly scenic trekking routes away from the crowds.',
 array['Point Lenana Summit','Glacial Valleys','Alpine Flora & Fauna','Less Crowded Routes'], 'Kenya'),

('30000000-0000-0000-0000-000000000012', 'amboseli', 'Amboseli N.P.', 'Land of Giants', 'Park', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Amboseli_National_Park_and_Mt._Kilimanjaro.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/e/e1/Amboseli_National_Park_and_Mt._Kilimanjaro.jpg','https://upload.wikimedia.org/wikipedia/commons/3/35/Amboseli_Park_-_Kilimanjaro_elephant.jpg'],
 'Amboseli National Park is crowned by Mount Kilimanjaro, Africa''s highest peak, providing a breathtaking backdrop for game viewing. The park is famous for being the best place in the world to get close to free-ranging elephants. It encompasses five main wildlife habitats, plus a generally dry lakebed, Lake Amboseli. Visitors can explore the swamps that are lifeblood for elephants, hippos, and abundant birdlife.',
 array['Huge Elephant Herds','Kilimanjaro Backdrop','Observation Hill','Rich Birdlife'], 'Kenya'),

('30000000-0000-0000-0000-000000000013', 'tarangire', 'Tarangire N.P.', 'Baobab Capital', 'Park', 4.8,
 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Baobab_at_sunset_-_Tanzania.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/f/fb/Baobab_at_sunset_-_Tanzania.jpg','https://upload.wikimedia.org/wikipedia/commons/8/82/Elefanten_fressen_Baobab-Rinde.jpg'],
 'Tarangire National Park is uniquely characterized by its striking landscape dotted with ancient, massive baobab trees and termite mounds. During the dry season, the Tarangire River becomes the only source of water, drawing incredibly dense concentrations of wildlife, including massive herds of elephants. It is a lesser-known gem of the northern circuit, offering a quieter, deeply rewarding safari experience.',
 array['Giant Baobab Trees','Large Elephant Herds','Tree-Climbing Pythons','Excellent Birdwatching'], 'Tanzania'),

('30000000-0000-0000-0000-000000000014', 'volcanoes-np', 'Volcanoes N.P.', 'Gorillas in the Mist', 'Forest', 4.9,
 'https://upload.wikimedia.org/wikipedia/commons/d/df/Muhabura%2CGahinga_and_Sabyinyo.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/d/df/Muhabura%2CGahinga_and_Sabyinyo.jpg','https://upload.wikimedia.org/wikipedia/commons/d/de/Mountain_gorilla_from_Susa_Group_in_Karisimbi_thicket_of_Volcanoes_National_Park_in_Rwanda._Emmanuel_Kwizera.jpg'],
 'Volcanoes National Park, set high in the lush Virunga Mountains, is a haven for the critically endangered mountain gorillas and golden monkeys. Made famous by the work of primatologist Dian Fossey, this dramatic park encompasses five imposing volcanoes shrouded in montane forest and bamboo. Trekking through this mystical landscape to encounter a gorilla family is a deeply moving and once-in-a-lifetime experience.',
 array['Mountain Gorilla Trekking','Golden Monkey Tracking','Dian Fossey Tomb Hike','Breathtaking Volcanic Scenery'], 'Rwanda'),

('30000000-0000-0000-0000-000000000015', 'murchison-falls', 'Murchison Falls', 'The Powerful Nile', 'Park', 4.7,
 'https://upload.wikimedia.org/wikipedia/commons/5/50/Murchison_Falls%2C_Uganda_01.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/5/50/Murchison_Falls%2C_Uganda_01.jpg','https://upload.wikimedia.org/wikipedia/commons/7/76/Murchison_Falls%2C_Nile%2C_Uganda_%2817052663192%29.jpg'],
 'Murchison Falls National Park is Uganda''s largest conservation area, bisected by the mighty Victoria Nile. The park''s centerpiece is the explosive Murchison Falls, where the world''s longest river forces its way through a narrow 7-meter gorge, creating a thunderous roar and a permanent rainbow. The park offers superb game viewing, including lions, leopards, elephants, and the rare shoebill stork.',
 array['Boat Cruise to the Falls','Top of the Falls View','Abundant Nile Crocodiles','Chimpanzee Trekking in Budongo'], 'Uganda'),

('30000000-0000-0000-0000-000000000016', 'lake-kivu', 'Lake Kivu', 'Emerald Waters', 'Lake', 4.8,
 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Lake_Kivu_%28_Rwanda_%29.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/1/1f/Lake_Kivu_%28_Rwanda_%29.jpg','https://upload.wikimedia.org/wikipedia/commons/0/00/Lake_Kivu_beach_featuring_touring_boats.jpg'],
 'Lake Kivu is one of Africa''s Great Lakes, situated on the border between Rwanda and the Democratic Republic of the Congo. Known for its stunning emerald green waters and surrounding terraced hills, it offers a peaceful retreat after thrilling gorilla treks. Visitors can enjoy kayaking, boat rides to coffee islands, and relaxing on sandy shores. The region is also famous for the scenic Congo Nile Trail.',
 array['Congo Nile Trail','Kayaking & Boat Tours','Coffee Farm Visits','Relaxing Beachside Retreats'], 'Rwanda'),

('30000000-0000-0000-0000-000000000017', 'tsavo-east', 'Tsavo East N.P.', 'Theater of the Wild', 'Safari', 4.6,
 'https://images.unsplash.com/photo-1481464904474-a575a33b44a0?auto=format&fit=crop&w=800&q=80',
 array['https://images.unsplash.com/photo-1481464904474-a575a33b44a0?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'],
 'Tsavo East is one of the oldest and largest parks in Kenya, renowned for its seemingly endless, semi-arid plains and the legendary ''Red Elephants'' — elephants that dust themselves with the park''s iron-rich red soil. It forms a massive wilderness area divided by the Galana River, offering striking landscapes, dramatic waterfalls like Lugard Falls, and incredible biodiversity away from the typical tourist trails.',
 array['Red Elephants of Tsavo','Lugard Falls','Yatta Plateau','Man-Eaters of Tsavo History'], 'Kenya'),

('30000000-0000-0000-0000-000000000018', 'stone-town', 'Stone Town', 'Historical Heart', 'Heritage', 4.7,
 'https://upload.wikimedia.org/wikipedia/commons/8/81/Parque_Forodhani%2C_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_29-31_HDR.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/8/81/Parque_Forodhani%2C_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_29-31_HDR.jpg','https://upload.wikimedia.org/wikipedia/commons/1/18/Fuerte_Viejo%2C_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_32.jpg'],
 'Stone Town is the vibrant, historical heart of Zanzibar City and a UNESCO World Heritage site. Wandering through its labyrinth of narrow alleys feels like stepping back in time. The town is a melting pot of Arab, Persian, Indian, and European influences, reflected in its stunning brass-studded doors, grand merchant houses, and bustling bazaars. It''s an essential stop for culture lovers visiting the spice island.',
 array['House of Wonders','Forodhani Gardens Night Market','Intricate Carved Doors','Rich History & Culture'], 'Tanzania'),

('30000000-0000-0000-0000-000000000019', 'lake-manyara', 'Lake Manyara N.P.', 'Tree-Climbing Lions', 'Park', 4.7,
 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Lake_Manyara_north.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/1/1c/Lake_Manyara_north.jpg','https://upload.wikimedia.org/wikipedia/commons/4/48/Lake_Manyara_Wildlife.jpg'],
 'Lake Manyara National Park sits at the base of the Great Rift Valley escarpment, its groundwater forest and shimmering soda lake supporting an unusually high density of wildlife for its size. It is famous for tree-climbing lions and, when water levels are right, vast pink flocks of flamingos lining the shore — all within a compact, easy-to-explore park.',
 array['Tree-Climbing Lions','Flamingo-Lined Shoreline','Rift Valley Escarpment Views','Seasonal Canoeing'], 'Tanzania'),

('30000000-0000-0000-0000-000000000020', 'kibale', 'Kibale Forest N.P.', 'Primate Capital of Africa', 'Forest', 4.8,
 'https://upload.wikimedia.org/wikipedia/commons/8/86/013_Alpha_male_chimpanzee_at_Kibale_forest_National_Park_Photo_by_Giles_Laurent.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/8/86/013_Alpha_male_chimpanzee_at_Kibale_forest_National_Park_Photo_by_Giles_Laurent.jpg','https://upload.wikimedia.org/wikipedia/commons/7/71/Chimpanzee%2C_Kibale_National_Park%2C_Uganda_%2852938250820%29.jpg'],
 'Kibale Forest National Park is East Africa''s primate capital, home to over a thousand habituated chimpanzees across thirteen primate species. Guided forest walks bring you face-to-face with wild chimp communities, while the neighboring Bigodi Wetland Sanctuary rewards visitors with exceptional birdlife and guided community-run walks.',
 array['Chimpanzee Trekking','13 Primate Species','Bigodi Wetland Walks','Ancient Rainforest'], 'Uganda'),

('30000000-0000-0000-0000-000000000021', 'queen-elizabeth', 'Queen Elizabeth N.P.', 'Land of Crater Lakes', 'Park', 4.7,
 'https://upload.wikimedia.org/wikipedia/commons/6/62/Lion_in_Queen_Elizabeth_National_Park_Uganda_01.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/6/62/Lion_in_Queen_Elizabeth_National_Park_Uganda_01.jpg','https://upload.wikimedia.org/wikipedia/commons/a/a1/Lions_in_the_Grasslands_of_Queen_Elizabeth_National_Park%2C_Uganda_11.jpg'],
 'Queen Elizabeth National Park spans dramatic scenery from open savannah to volcanic crater lakes, centered on the Kazinga Channel — a natural waterway teeming with hippos and elephants. Its Ishasha sector is famous for tree-climbing lions draped across fig tree branches, a behavior rarely seen elsewhere in Africa.',
 array['Ishasha Tree-Climbing Lions','Kazinga Channel Boat Safari','Volcanic Crater Lakes','Kyambura Gorge Chimp Tracking'], 'Uganda'),

('30000000-0000-0000-0000-000000000022', 'nyungwe-forest', 'Nyungwe Forest N.P.', 'Canopy Walk Adventure', 'Forest', 4.8,
 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Nyungwe_Canopy_Walk.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/e/eb/Nyungwe_Canopy_Walk.jpg','https://upload.wikimedia.org/wikipedia/commons/1/1e/Nyungwe_Inside_Canopy_Walk.jpg'],
 'Nyungwe Forest is one of Africa''s oldest montane rainforests and home to East Africa''s only forest canopy walkway, suspended 70 metres above the forest floor. Its trails wind past cascading waterfalls and through habitat for chimpanzees and a dozen other primate species, making it a rewarding stop for hikers and primate trackers alike.',
 array['Africa''s Only Forest Canopy Walkway','Chimpanzee & Colobus Tracking','Ancient Montane Rainforest','Waterfall Hiking Trails'], 'Rwanda'),

('30000000-0000-0000-0000-000000000023', 'akagera', 'Akagera N.P.', 'Rwanda''s Big Five', 'Park', 4.7,
 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Akagera_National_Park_Rwanda.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/c/c3/Akagera_National_Park_Rwanda.jpg','https://upload.wikimedia.org/wikipedia/commons/1/15/Giraffe_at_Akagera_National_Park.jpg'],
 'Akagera National Park is Rwanda''s Big Five safari destination — a mosaic of savannah, wetland and lake along the Tanzanian border, restored from near-collapse into one of Africa''s great conservation comeback stories. Boat safaris on Lake Ihema reveal hippos and crocodiles by the hundreds, alongside lion, rhino, elephant, buffalo and leopard on game drives.',
 array['Big Five Game Viewing','Boat Safari on Lake Ihema','Conservation Success Story','Rwanda''s Only Savannah Park'], 'Rwanda'),

('30000000-0000-0000-0000-000000000024', 'samburu', 'Samburu N.R.', 'The Samburu Special Five', 'Safari', 4.6,
 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Samburu_National_Reserve%2C_Kenya-26December2012.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/6/6a/Samburu_National_Reserve%2C_Kenya-26December2012.jpg','https://upload.wikimedia.org/wikipedia/commons/d/d0/Reserve_samburu_faune_2.jpg'],
 'Samburu National Reserve, in Kenya''s arid north, is famous for the ''Samburu Special Five'' — species found almost nowhere else on a classic safari circuit, including the reticulated giraffe, Grevy''s zebra, gerenuk, Beisa oryx and Somali ostrich. The Ewaso Nyiro River sustains dramatic wildlife concentrations against striking semi-arid scenery, alongside rich Samburu cultural heritage.',
 array['Samburu Special Five','Ewaso Nyiro River Game Viewing','Samburu Cultural Encounters','Dramatic Arid Landscapes'], 'Kenya'),

('30000000-0000-0000-0000-000000000025', 'lake-naivasha', 'Lake Naivasha', 'Rift Valley Retreat', 'Lake', 4.6,
 'https://upload.wikimedia.org/wikipedia/commons/3/36/Lake_Naivasha_Kenya_pelican.jpg',
 array['https://upload.wikimedia.org/wikipedia/commons/3/36/Lake_Naivasha_Kenya_pelican.jpg','https://upload.wikimedia.org/wikipedia/commons/f/f9/Lake_Naivasha_Kenya_15.jpg'],
 'Lake Naivasha is a freshwater Rift Valley lake ringed by acacia woodland and flower farms, best explored by boat past pods of hippos and fish eagles. It''s a relaxed stop en route to the Masai Mara, with walking safaris possible among giraffe and zebra on nearby Crescent Island.',
 array['Boat Safaris & Hippo Viewing','Crescent Island Walking Safari','African Fish Eagle Sightings','Rift Valley Scenery'], 'Kenya');

-- ============================================================
-- PACKAGES (7 — platform-curated trip packages)
-- ============================================================
insert into public.packages (id, company_id, title, destination, duration_days, price_from, price_to, best_for, image, highlights, description, is_active) values
('40000000-0000-0000-0000-000000000001', null, 'Serengeti & Mara Migration Safari', 'Serengeti & Maasai Mara', 10, 3500, 5500, 'Couple',
 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Wildebeest_migration_%287513594286%29.jpg',
 array['Cross-border game drives','Luxury tented camp','Crater rim sunsets','Balloon Safari'],
 'Follow the Great Migration across the Serengeti-Mara ecosystem on a ten-day cross-border safari, staying in luxury tented camps with crater-rim sunsets and an optional hot air balloon safari.', true),
('40000000-0000-0000-0000-000000000002', null, 'Zanzibar & Diani Coastal Escape', 'Zanzibar & Diani Beach', 7, 1500, 2800, 'Couple',
 'https://upload.wikimedia.org/wikipedia/commons/0/04/White_sandy_beach_at_Nungwi%2C_Zanzibar.jpg',
 array['Beachfront resorts','Spice tour','Sunset dhow cruise','Kitesurfing lessons'],
 'A seven-day coastal escape pairing Zanzibar''s spice-scented beaches with Diani''s kitesurfing-friendly shores, including a traditional sunset dhow cruise.', true),
('40000000-0000-0000-0000-000000000003', null, 'Kilimanjaro Machame Climb', 'Mt. Kilimanjaro', 8, 2100, 3200, 'Group',
 'https://upload.wikimedia.org/wikipedia/commons/2/23/The_view_of_mountain_Kilimanjaro_from_Moshi_town_in_Tanzania.jpg',
 array['Machame route','Pro guides','Summit Uhuru Peak','Camping'],
 'An eight-day ascent of Kilimanjaro via the scenic Machame route, with professional KPAP-certified guides and full camping support to the summit of Uhuru Peak.', true),
('40000000-0000-0000-0000-000000000004', null, 'Ultimate Primate Expedition', 'Bwindi & Kibale', 6, 2800, 4200, 'Solo',
 'https://upload.wikimedia.org/wikipedia/commons/3/38/Mountain_gorilla%2C_2-year-old%2C_Mubare_Group%2C_Buhoma%2C_Bwindi_Impenetrable_Forest%2C_Uganda.jpg',
 array['Gorilla Trekking','Chimpanzee Habituation','Jungle Lodges','Community walks'],
 'Six days tracking mountain gorillas in Bwindi and chimpanzees in Kibale Forest, staying in jungle lodges with community walk experiences.', true),
('40000000-0000-0000-0000-000000000005', null, 'Lamu Swahili Retreat', 'Lamu Island', 5, 900, 1800, 'Solo',
 'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=800&q=80',
 array['Old Town Heritage Walk','Dhow Sailing','Boutique Riad','Swahili Cooking Class'],
 'A slow, five-day retreat on car-free Lamu Island — heritage walks through the old town, dhow sailing and a hands-on Swahili cooking class.', true),
('40000000-0000-0000-0000-000000000006', null, 'Northern Circuit Grand Tour', 'Arusha → Serengeti', 10, 3800, 5800, 'Group',
 'https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Ngorongoro_crater%2C_Tanzania_.01.jpg',
 array['4 parks','Ngorongoro descent','Maasai village','Lake Manyara flamingos'],
 'The definitive ten-day northern Tanzania circuit — four parks, a full Ngorongoro Crater descent, a Maasai village visit and Lake Manyara''s flamingo-lined shores.', true),
('40000000-0000-0000-0000-000000000007', null, 'Ruaha Wild Frontier', 'Ruaha National Park', 5, 1800, 3000, 'Solo',
 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
 array['Walking Safaris','Wild Dog Tracking','Remote Bush Camps','Night Drives'],
 'Five days in Tanzania''s wildest, least-visited park — walking safaris, African wild dog tracking, and remote bush camps with night drives.', true);
