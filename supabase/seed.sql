-- Golden Tours seed data
-- Demo admin + customer accounts, real East Africa destinations & packages,
-- and sample bookings/payments/reviews/enquiries/AI conversations so every
-- dashboard and report renders with realistic data on first run.
--
-- Demo login credentials (documented in README):
--   Admin:    grace.mwangi@goldentours.africa    / GoldenAdmin2026!
--   Customer: james.whitfield@example.com        / Traveler2026!
-- (all seeded customers share the password Traveler2026!)

-- ============================================================
-- 1. USERS (auth.users + auth.identities)
-- ============================================================
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   'grace.mwangi@goldentours.africa', crypt('GoldenAdmin2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Grace Mwangi","phone":"+255 754 112 233"}',
   now() - interval '400 days', now() - interval '400 days', '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   'james.whitfield@example.com', crypt('Traveler2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"James Whitfield","phone":"+1 415 555 0182"}',
   now() - interval '340 days', now() - interval '340 days', '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated',
   'sophie.bennett@example.com', crypt('Traveler2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Sophie Bennett","phone":"+44 7700 900321"}',
   now() - interval '300 days', now() - interval '300 days', '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated',
   'lukas.weber@example.com', crypt('Traveler2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Lukas Weber","phone":"+49 151 23456789"}',
   now() - interval '210 days', now() - interval '210 days', '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated',
   'amara.okafor@example.com', crypt('Traveler2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Amara Okafor","phone":"+234 803 555 0147"}',
   now() - interval '260 days', now() - interval '260 days', '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated',
   'chen.wei@example.com', crypt('Traveler2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Chen Wei","phone":"+65 8123 4567"}',
   now() - interval '190 days', now() - interval '190 days', '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated',
   'isabella.rossi@example.com', crypt('Traveler2026!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Isabella Rossi","phone":"+39 348 555 0199"}',
   now() - interval '150 days', now() - interval '150 days', '', '', '', '');

insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id::text, u.id,
       jsonb_build_object('sub', u.id::text, 'email', u.email),
       'email', now(), u.created_at, u.created_at
from auth.users u
where u.id in (
  '10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000007'
);

-- promote the operations director + set nationalities (the signup trigger already created the profile rows)
update public.profiles set role = 'admin' where id = '10000000-0000-0000-0000-000000000001';
update public.profiles set nationality = 'United States' where id = '10000000-0000-0000-0000-000000000002';
update public.profiles set nationality = 'United Kingdom' where id = '10000000-0000-0000-0000-000000000003';
update public.profiles set nationality = 'Germany' where id = '10000000-0000-0000-0000-000000000004';
update public.profiles set nationality = 'Nigeria' where id = '10000000-0000-0000-0000-000000000005';
update public.profiles set nationality = 'Singapore' where id = '10000000-0000-0000-0000-000000000006';
update public.profiles set nationality = 'Italy' where id = '10000000-0000-0000-0000-000000000007';

-- ============================================================
-- 2. DESTINATIONS
-- ============================================================
insert into public.destinations (id, slug, name, country, category, short_description, description, best_season, highlights, lat, lng, images) values

('20000000-0000-0000-0000-000000000001', 'serengeti-national-park', 'Serengeti National Park', 'Tanzania', 'wildlife',
 'Endless golden plains and the stage for the Great Migration.',
 'The Serengeti is Tanzania''s most celebrated wilderness — 14,750 km² of open savannah, riverine forest and kopjes that host the largest terrestrial mammal migration on Earth. Over two million wildebeest, zebra and gazelle move in a clockwise circuit through the ecosystem each year, drawing lion, leopard, cheetah and hyena in their wake. Beyond the migration, the Serengeti holds resident prides year-round and some of the best big-cat sighting odds in Africa.',
 'Jun–Oct (dry season game viewing); Jan–Mar (calving season, southern plains); Jul–Sep (Mara River crossings)',
 array['Great Migration river crossings','Resident Big Five populations','Hot air balloon safaris at dawn','Seronera Valley year-round predator sightings','Endless horizon views from granite kopjes'],
 -2.3333, 34.8333,
 array['https://upload.wikimedia.org/wikipedia/commons/0/0d/Wildebeest_migration_%287513594286%29.jpg','https://upload.wikimedia.org/wikipedia/commons/6/64/Wildebeest_on_the_Great_Migration_in_the_northern_Serengeti_%284%29_%2828630075195%29.jpg']),

('20000000-0000-0000-0000-000000000002', 'ngorongoro-crater', 'Ngorongoro Crater', 'Tanzania', 'wildlife',
 'A collapsed volcanic caldera nicknamed "Africa''s Garden of Eden."',
 'The Ngorongoro Crater is the world''s largest intact volcanic caldera, a 610-metre-deep, 260 km² natural amphitheater holding an estimated 25,000 large mammals in permanent residence — including one of Tanzania''s best chances to see black rhino. The crater floor''s mix of grassland, swamp, forest and soda lake supports year-round wildlife density unmatched anywhere else on the continent, all viewable in a single unforgettable day descent.',
 'Year-round; June–September offers the driest, clearest conditions',
 array['One of Africa''s best black rhino sighting locations','Year-round wildlife density inside the caldera','Maasai communities on the crater highlands','Lake Magadi flamingo flocks','UNESCO World Heritage & Biosphere Reserve'],
 -3.2000, 35.5000,
 array['https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Ngorongoro_crater%2C_Tanzania_.01.jpg','https://upload.wikimedia.org/wikipedia/commons/1/10/Zebras_Ngorongoro_Crater.jpg']),

('20000000-0000-0000-0000-000000000003', 'zanzibar-stone-town', 'Zanzibar — Stone Town', 'Zanzibar', 'culture',
 'A UNESCO-listed maze of coral-stone alleys, spice markets and Swahili-Arab heritage.',
 'Stone Town is the historic heart of Zanzibar City, a UNESCO World Heritage Site where narrow winding streets, ornately carved wooden doors, bustling bazaars and centuries of Swahili, Arab, Persian, Indian and European influence converge. Wander the spice markets, visit the House of Wonders and the old slave-trade sites, and watch the sun set over the harbor from a rooftop café — Stone Town rewards slow, curious exploration.',
 'Year-round; June–October and December–February are driest and most comfortable for walking tours',
 array['UNESCO World Heritage old town','Spice market & guided spice farm tours','Iconic carved Zanzibari doors','Freddie Mercury''s birthplace','Forodhani Gardens night food market'],
 -6.1659, 39.1990,
 array['https://upload.wikimedia.org/wikipedia/commons/8/81/Parque_Forodhani%2C_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_29-31_HDR.jpg','https://upload.wikimedia.org/wikipedia/commons/1/18/Fuerte_Viejo%2C_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_32.jpg']),

('20000000-0000-0000-0000-000000000004', 'zanzibar-beaches', 'Zanzibar — Nungwi & Kendwa Beaches', 'Zanzibar', 'beach',
 'Powder-white sand and warm turquoise Indian Ocean water on Zanzibar''s northern tip.',
 'Nungwi and Kendwa, on Zanzibar''s northern tip, are the island''s postcard beaches — fine white sand, shallow reef-protected turquoise water largely unaffected by tides, and a laid-back string of beach bars and dhow builders'' yards. It''s the island''s premier base for swimming, snorkeling trips to Mnemba Atoll, sunset dhow cruises and simply doing nothing at all.',
 'Jun–Oct and Dec–Feb (driest, calmest seas); avoid Apr–May long rains',
 array['Mnemba Atoll snorkeling & diving','Traditional dhow sunset cruises','Tide-independent swimming beaches','Beachfront seafood dining','Kite-surfing at Paje (day trip)'],
 -5.7241, 39.2986,
 array['https://upload.wikimedia.org/wikipedia/commons/4/4c/Dhow_Sunset%2C_Zanzibar_%2810164046475%29.jpg','https://upload.wikimedia.org/wikipedia/commons/0/04/White_sandy_beach_at_Nungwi%2C_Zanzibar.jpg']),

('20000000-0000-0000-0000-000000000005', 'mount-kilimanjaro', 'Mount Kilimanjaro', 'Tanzania', 'mountain',
 'Africa''s highest peak — a snow-capped free-standing giant rising from the savannah.',
 'At 5,895 metres, Kilimanjaro is the highest mountain in Africa and the world''s tallest free-standing mountain. No technical climbing skills are required to summit Uhuru Peak, but the altitude demands proper acclimatization — routes of 6 to 9 days give trekkers the best odds of success while passing through five distinct climate zones, from rainforest to alpine desert to arctic summit.',
 'Jan–mid Mar and Jun–Oct (driest climbing windows)',
 array['Uhuru Peak — Africa''s highest point','Five climate zones in a single trek','Machame, Marangu, Lemosho & Rongai routes','Certified guides & porter teams','Glacier views on the summit crater rim'],
 -3.0674, 37.3556,
 array['https://upload.wikimedia.org/wikipedia/commons/2/23/The_view_of_mountain_Kilimanjaro_from_Moshi_town_in_Tanzania.jpg','https://upload.wikimedia.org/wikipedia/commons/1/1c/Kilimanjaro_viewed_from_Moshi.jpg']),

('20000000-0000-0000-0000-000000000006', 'tarangire-national-park', 'Tarangire National Park', 'Tanzania', 'wildlife',
 'Ancient baobabs and Tanzania''s largest elephant herds outside the Serengeti.',
 'Tarangire is famed for its dramatic landscape of towering baobab trees and its huge elephant population — herds of several hundred are a common sight during the dry season, when wildlife concentrates along the Tarangire River. Less visited than the Serengeti, it offers an authentic, uncrowded safari experience with excellent birdlife alongside classic plains game.',
 'Jun–Oct (dry season — wildlife concentrates along the river)',
 array['Tanzania''s largest elephant herds','Iconic ancient baobab landscapes','Over 550 recorded bird species','Tree-climbing pythons & pyramid termite mounds','Far fewer vehicles than the Serengeti'],
 -3.8330, 35.8500,
 array['https://upload.wikimedia.org/wikipedia/commons/8/82/Elefanten_fressen_Baobab-Rinde.jpg']),

('20000000-0000-0000-0000-000000000007', 'lake-manyara', 'Lake Manyara National Park', 'Tanzania', 'lake',
 'A shallow soda lake beneath the Rift Valley escarpment, home to tree-climbing lions.',
 'Compact but richly biodiverse, Lake Manyara National Park sits at the base of the Great Rift Valley escarpment. Its groundwater forest, acacia woodland and shimmering soda lake support an unusually high density of wildlife for its size, including the region''s famous tree-climbing lions, large baboon troops, and — when water levels are right — vast flocks of flamingos along the shoreline.',
 'Jun–Oct (dry season) and Nov–Feb for peak flamingo numbers',
 array['Tree-climbing lions','Flamingo flocks on the soda lake shoreline','Dramatic Rift Valley escarpment backdrop','Canoeing on the lake (seasonal)','Groundwater forest troupes of baboon and blue monkey'],
 -3.3833, 35.8167,
 array['https://upload.wikimedia.org/wikipedia/commons/1/1c/Lake_Manyara_north.jpg']),

('20000000-0000-0000-0000-000000000008', 'masai-mara', 'Masai Mara National Reserve', 'Kenya', 'wildlife',
 'Kenya''s crown jewel — rolling grassland and the world-famous Mara River crossings.',
 'The Masai Mara is the northern extension of the Serengeti ecosystem and arguably East Africa''s most famous safari destination. Its open grassland offers superb visibility for spotting the Big Five, and from July to October the reserve hosts the dramatic Mara River crossings as the Great Migration surges north from Tanzania — one of the most electrifying wildlife spectacles on the planet.',
 'Jul–Oct (migration river crossings); Jan–Feb also excellent for resident game',
 array['Mara River wildebeest crossings','High density of lion, cheetah and leopard','Maasai cultural village visits','Hot air balloon safaris at sunrise','Exceptional year-round resident wildlife'],
 -1.4061, 35.0117,
 array['https://upload.wikimedia.org/wikipedia/commons/8/85/Safari_vehicles_watching_lion_couple_in_Maasai_Mara%2C_Kenya.jpg','https://upload.wikimedia.org/wikipedia/commons/b/b8/Safari_in_The_Maasai_Mara_%2843837384641%29.jpg']),

('20000000-0000-0000-0000-000000000009', 'amboseli-national-park', 'Amboseli National Park', 'Kenya', 'wildlife',
 'Free-ranging elephant herds framed by the snowcap of Mount Kilimanjaro.',
 'Amboseli is renowned for offering the most reliable close-up elephant encounters in Africa, set against the unbeatable backdrop of Mount Kilimanjaro rising across the Tanzanian border. Its swamps, fed by underground rivers from the mountain, sustain large herds year-round, making it one of the best places in the world to photograph elephants with a snow-capped peak behind them.',
 'Jun–Oct and Jan–Feb (clearest Kilimanjaro views, dry underfoot conditions)',
 array['Iconic elephant herds beneath Kilimanjaro','Some of Kenya''s most photographed views','Observation Hill panoramic viewpoint','Maasai community conservancies nearby','Excellent swamp-edge birdlife'],
 -2.6520, 37.2606,
 array['https://upload.wikimedia.org/wikipedia/commons/e/e1/Amboseli_National_Park_and_Mt._Kilimanjaro.jpg','https://upload.wikimedia.org/wikipedia/commons/3/35/Amboseli_Park_-_Kilimanjaro_elephant.jpg']),

('20000000-0000-0000-0000-000000000010', 'lake-nakuru', 'Lake Nakuru National Park', 'Kenya', 'wildlife',
 'A soda lake famous for flamingo flocks and successful rhino conservation.',
 'Lake Nakuru National Park is a compact Rift Valley sanctuary best known historically for its vast flamingo flocks, and today equally celebrated as one of Kenya''s most successful rhino sanctuaries, protecting both black and white rhino behind electrified perimeter fencing. Acacia woodland surrounding the lake also shelters Rothschild''s giraffe, lion and leopard.',
 'Jun–Sep (dry season) and Dec–Feb; flamingo numbers vary with lake water levels',
 array['Black & white rhino sanctuary','Historic flamingo-lined shoreline','Rothschild''s giraffe population','Compact park ideal for shorter add-on visits','Strong ranger-led anti-poaching success story'],
 -0.3667, 36.0833,
 array['https://upload.wikimedia.org/wikipedia/commons/0/0f/Flamingos_in_Lake_Nakuru.jpg']),

('20000000-0000-0000-0000-000000000011', 'diani-beach', 'Diani Beach', 'Kenya', 'beach',
 'Kenya''s award-winning stretch of white sand on the Indian Ocean coast.',
 'South of Mombasa, Diani Beach is repeatedly ranked among Africa''s best beaches — a long, gently curving stretch of white coral sand shaded by palms, fringed by a protective coral reef that keeps the water calm and clear. It''s an easy, relaxed coastal add-on to a Kenyan safari, with strong options for snorkeling, deep-sea fishing, kite-surfing and the nearby Colobus Conservation forest.',
 'Jan–Mar and Jun–Oct (driest, sunniest); avoid Apr–May long rains',
 array['Reef-protected calm swimming water','Colobus monkey forest conservation area','Deep-sea fishing charters','Kite-surfing & water sports','Easy coastal extension after a Kenya safari'],
 -4.3167, 39.5833,
 array['https://upload.wikimedia.org/wikipedia/commons/8/8d/Diani_Beach%2C_Kenya_-_panoramio.jpg']),

('20000000-0000-0000-0000-000000000012', 'bwindi-impenetrable-forest', 'Bwindi Impenetrable Forest', 'Uganda', 'gorilla',
 'A UNESCO rainforest sheltering nearly half the world''s remaining mountain gorillas.',
 'Bwindi Impenetrable National Park is an ancient, mist-covered rainforest in southwestern Uganda that shelters roughly half of the world''s remaining mountain gorilla population across several habituated family groups. Trekking through dense, steep forest to spend one profound hour with a gorilla family is widely considered one of the most moving wildlife encounters on Earth — and Uganda''s trekking permits remain significantly less expensive than Rwanda''s.',
 'Jun–Aug and Dec–Feb (drier trekking conditions, though treks run year-round)',
 array['Nearly half the world''s mountain gorillas','More affordable permits than Rwanda','Batwa pygmy cultural encounters','UNESCO World Heritage rainforest','Over 350 bird species for keen birders'],
 -1.0654, 29.6285,
 array['https://upload.wikimedia.org/wikipedia/commons/c/cd/Mountain_gorilla_%28Gorilla_beringei_beringei%29_three_2-year-olds.jpg','https://upload.wikimedia.org/wikipedia/commons/3/38/Mountain_gorilla%2C_2-year-old%2C_Mubare_Group%2C_Buhoma%2C_Bwindi_Impenetrable_Forest%2C_Uganda.jpg']),

('20000000-0000-0000-0000-000000000013', 'murchison-falls', 'Murchison Falls National Park', 'Uganda', 'adventure',
 'The Nile explodes through a 7-metre gorge — Uganda''s largest and most powerful national park.',
 'Uganda''s largest national park is bisected by the Victoria Nile, which is forced through a narrow 7-metre gorge before plunging 43 metres in a thunderous display that gives the park its name. A boat safari to the base of the falls, a hike to the top, and game drives across the northern savannah for lion, giraffe and elephant combine with chimpanzee trekking in the adjacent Budongo Forest Reserve.',
 'Dec–Feb and Jun–Sep (dry season, easier game viewing and forest trekking)',
 array['Boat safari to the base of the falls','Chimpanzee trekking in Budongo Forest','Top-of-the-falls Nile gorge hike','Big game drives on the northern bank','Uganda''s most powerful waterfall'],
 2.2833, 31.6833,
 array['https://upload.wikimedia.org/wikipedia/commons/5/50/Murchison_Falls%2C_Uganda_01.jpg']),

('20000000-0000-0000-0000-000000000014', 'queen-elizabeth-national-park', 'Queen Elizabeth National Park', 'Uganda', 'wildlife',
 'Crater lakes, tree-climbing lions and Nile hippos along the Kazinga Channel.',
 'Queen Elizabeth National Park spans dramatic scenery from savannah to volcanic crater lakes to the Kazinga Channel, a natural waterway connecting Lake Edward and Lake George that hosts one of the highest hippo concentrations in Africa. The Ishasha sector is famous for tree-climbing lions draped across fig tree branches, a behavior rarely seen elsewhere.',
 'Jun–Sep and Dec–Feb (dry season game viewing)',
 array['Ishasha sector tree-climbing lions','Kazinga Channel boat safari — huge hippo & bird numbers','Volcanic crater lake scenery','Chimpanzee tracking in Kyambura Gorge','Excellent year-round birding (over 600 species)'],
 -0.2000, 29.9000,
 array['https://upload.wikimedia.org/wikipedia/commons/6/62/Lion_in_Queen_Elizabeth_National_Park_Uganda_01.jpg']),

('20000000-0000-0000-0000-000000000015', 'volcanoes-national-park-rwanda', 'Volcanoes National Park', 'Rwanda', 'gorilla',
 'Misty Virunga volcanoes and Rwanda''s world-famous habituated gorilla families.',
 'Volcanoes National Park protects the Rwandan side of the Virunga Massif, a chain of dormant volcanoes cloaked in bamboo and montane forest. It is the site of Dian Fossey''s pioneering gorilla research and today offers some of the most accessible, well-organized mountain gorilla trekking in the world, alongside golden monkey trekking through the bamboo understory.',
 'Jun–Sep and Dec–Feb (drier trekking conditions)',
 array['World-renowned habituated gorilla families','Golden monkey trekking','Dian Fossey research heritage site','Dramatic Virunga volcano scenery','Shorter average trek times than Bwindi'],
 -1.4833, 29.5000,
 array['https://upload.wikimedia.org/wikipedia/commons/d/df/Muhabura%2CGahinga_and_Sabyinyo.jpg','https://upload.wikimedia.org/wikipedia/commons/d/de/Mountain_gorilla_from_Susa_Group_in_Karisimbi_thicket_of_Volcanoes_National_Park_in_Rwanda._Emmanuel_Kwizera.jpg']),

('20000000-0000-0000-0000-000000000016', 'lake-kivu', 'Lake Kivu', 'Rwanda', 'lake',
 'A vast, tranquil Rift Valley lake ringed by terraced hills — Rwanda''s answer to the riviera.',
 'One of Africa''s Great Lakes, Lake Kivu stretches along Rwanda''s western border in a setting of terraced hillsides, fishing villages and small volcanic islands. Its high altitude keeps the climate mild year-round, and — unusually for a tropical African lake — it is bilharzia-free and safe for swimming, making it a favored place to unwind after gorilla trekking in the nearby Virunga mountains.',
 'Year-round; Jun–Sep and Dec–Feb are driest',
 array['Safe, bilharzia-free swimming','Congo Nile Trail hiking & cycling','Relaxed lakeside lodges after gorilla trekking','Traditional fishing boat sunset outings','Coffee & tea plantation tours on the surrounding hills'],
 -1.9667, 29.2667,
 array['https://upload.wikimedia.org/wikipedia/commons/1/1f/Lake_Kivu_%28_Rwanda_%29.jpg']),

('20000000-0000-0000-0000-000000000017', 'nyungwe-forest', 'Nyungwe Forest National Park', 'Rwanda', 'adventure',
 'Ancient montane rainforest with East Africa''s only canopy walkway.',
 'Nyungwe is one of Africa''s oldest and best-preserved montane rainforests, home to chimpanzees, thirteen other primate species, and East Africa''s only canopy walkway, suspended 70 metres above the forest floor. Its network of trails through moss-draped forest and past cascading waterfalls makes it a rewarding stop for hikers, birders and primate trackers alike.',
 'Jun–Sep and Dec–Feb (drier trails, easier chimp tracking)',
 array['East Africa''s only forest canopy walkway','Chimpanzee & colobus monkey tracking','Ancient montane rainforest biodiversity','Waterfall hiking trails','Excellent Albertine Rift endemic birding'],
 -2.5000, 29.2000,
 array['https://upload.wikimedia.org/wikipedia/commons/e/eb/Nyungwe_Canopy_Walk.jpg']);

-- ============================================================
-- 3. TOUR PACKAGES
-- ============================================================
insert into public.packages (
  id, slug, title, destination_ids, countries, description, duration_days,
  price_min, price_max, currency, budget_level, interests, images, highlights,
  itinerary, map_points, best_months, group_size, featured
) values

('30000000-0000-0000-0000-000000000001', 'great-migration-serengeti-ngorongoro-safari', 'Great Migration Serengeti & Ngorongoro Safari',
 array['20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000006']::uuid[],
 array['Tanzania'],
 'A classic six-day northern circuit safari combining Tarangire''s elephant herds, the endless plains of the Serengeti, and a full-day descent into the Ngorongoro Crater — Tanzania''s three most iconic wildlife destinations in one expertly paced itinerary.',
 6, 2850, 3400, 'USD', 'mid-range', array['wildlife','adventure'],
 array['https://upload.wikimedia.org/wikipedia/commons/3/39/Zebra_in_the_Serengeti_Wildebeest_Migration.jpg','https://upload.wikimedia.org/wikipedia/commons/e/eb/Ballons_over_Maasai_Mara_landscape.jpg'],
 array['Witness the Great Migration (seasonal river crossings)','Full-day descent into the Ngorongoro Crater','Big Five game viewing with a private 4x4 vehicle','Tarangire''s elephant herds and ancient baobabs','English-speaking professional safari guide throughout'],
 '[{"day":1,"title":"Arrival in Arusha","description":"Met at Kilimanjaro International Airport and transferred to your lodge in Arusha for a welcome briefing and restful first night."},{"day":2,"title":"Tarangire National Park","description":"Morning drive to Tarangire for a full day among its famous elephant herds and towering baobab trees."},{"day":3,"title":"Central Serengeti","description":"Drive to the Serengeti via the Ngorongoro Highlands, entering the park in the afternoon for your first game drive across the Seronera Valley."},{"day":4,"title":"Full-Day Serengeti Migration Tracking","description":"A full day following the Great Migration herds with a picnic lunch out on the plains, timed to the migration''s seasonal location."},{"day":5,"title":"Ngorongoro Crater Floor","description":"Descend 600 metres onto the crater floor for a full morning game drive among dense wildlife, including a strong chance of black rhino."},{"day":6,"title":"Departure","description":"Final crater-rim breakfast with views over the caldera before your transfer back to Arusha or Kilimanjaro Airport."}]'::jsonb,
 '[{"name":"Arusha","lat":-3.3869,"lng":36.6830},{"name":"Tarangire National Park","lat":-3.8330,"lng":35.8500},{"name":"Serengeti National Park","lat":-2.3333,"lng":34.8333},{"name":"Ngorongoro Crater","lat":-3.2000,"lng":35.5000}]'::jsonb,
 array['January','February','March','June','July','August','September','October'],
 '2–8 people', true),

('30000000-0000-0000-0000-000000000002', 'zanzibar-beach-stone-town-escape', 'Zanzibar Beach & Stone Town Escape',
 array['20000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000004']::uuid[],
 array['Zanzibar'],
 'Five unhurried days pairing the UNESCO history of Stone Town with the postcard beaches of Nungwi — spice tours, dhow sunset cruises and Mnemba Atoll snorkeling included.',
 5, 1450, 1950, 'USD', 'mid-range', array['beach','culture','honeymoon'],
 array['https://upload.wikimedia.org/wikipedia/commons/8/81/Parque_Forodhani%2C_Stone_Town%2C_Zanz%C3%ADbar%2C_Tanzania%2C_2024-05-31%2C_DD_29-31_HDR.jpg','https://upload.wikimedia.org/wikipedia/commons/d/d6/Kendwa_Beach_%28Sunset_Kendwa_Hotel%29.JPG'],
 array['UNESCO World Heritage Stone Town walking tour','Traditional dhow sunset cruise','Snorkeling at Mnemba Atoll marine reserve','Turquoise beaches of Nungwi & Kendwa','Guided Zanzibar spice farm visit'],
 '[{"day":1,"title":"Arrival & Stone Town","description":"Arrive at Zanzibar Airport and transfer to your riad-style hotel in Stone Town."},{"day":2,"title":"Stone Town & Spice Tour","description":"Guided walking tour of Stone Town''s old quarter followed by an afternoon spice farm tour with a traditional Swahili lunch."},{"day":3,"title":"Transfer to Nungwi","description":"Drive north to Nungwi, checking into your beachfront hotel with the rest of the day free to relax on the sand."},{"day":4,"title":"Dhow Cruise & Mnemba Snorkeling","description":"Full-day snorkeling excursion to the Mnemba Atoll marine reserve, followed by a traditional dhow sunset cruise."},{"day":5,"title":"Departure","description":"Free morning on the beach before transfer to the airport for your onward flight."}]'::jsonb,
 '[{"name":"Stone Town","lat":-6.1659,"lng":39.1990},{"name":"Nungwi","lat":-5.7241,"lng":39.2986},{"name":"Mnemba Atoll","lat":-5.8167,"lng":39.3833}]'::jsonb,
 array['June','July','August','September','October','December','January','February'],
 '2–10 people', true),

('30000000-0000-0000-0000-000000000003', 'kilimanjaro-machame-route-climb', 'Kilimanjaro Machame Route Climb',
 array['20000000-0000-0000-0000-000000000005']::uuid[],
 array['Tanzania'],
 'A seven-day ascent of Kilimanjaro via the scenic Machame ("Whiskey") Route, built around a full extra acclimatization day to maximize your summit success rate to Uhuru Peak.',
 7, 2200, 2900, 'USD', 'mid-range', array['mountain','adventure'],
 array['https://upload.wikimedia.org/wikipedia/commons/b/b3/Kilimanjaro_Moshi.jpg','https://upload.wikimedia.org/wikipedia/commons/2/23/The_view_of_mountain_Kilimanjaro_from_Moshi_town_in_Tanzania.jpg'],
 array['Summit Uhuru Peak (5,895m), Africa''s highest point','Certified mountain guides, cooks and porter team','7-day route with a dedicated acclimatization day','All camping equipment and meals included','Rainforest to arctic-summit climate zones'],
 '[{"day":1,"title":"Machame Gate to Machame Camp","description":"Trek through montane rainforest from Machame Gate (1,800m) to Machame Camp (3,000m)."},{"day":2,"title":"Machame Camp to Shira Camp","description":"Climb through moorland to Shira Camp (3,840m), with views back over Kilimanjaro''s southern glaciers."},{"day":3,"title":"Shira Camp to Barranco Camp","description":"Ascend to the Lava Tower (4,630m) for acclimatization, then descend to sleep at Barranco Camp (3,960m) — climb high, sleep low."},{"day":4,"title":"Barranco Camp to Karanga Camp","description":"Scale the Barranco Wall in the morning and continue across the Karanga Valley to Karanga Camp (3,995m)."},{"day":5,"title":"Karanga Camp to Barafu Camp","description":"A shorter trekking day to Barafu Base Camp (4,673m), with an early dinner and rest before the summit attempt."},{"day":6,"title":"Summit Day — Uhuru Peak","description":"Depart around midnight for the summit push, reaching Uhuru Peak (5,895m) around sunrise before descending all the way to Mweka Camp (3,100m)."},{"day":7,"title":"Mweka Camp to Mweka Gate","description":"Final descent through rainforest to Mweka Gate, with a certificate ceremony and transfer back to Moshi."}]'::jsonb,
 '[{"name":"Machame Gate","lat":-3.1833,"lng":37.3167},{"name":"Barranco Camp","lat":-3.1167,"lng":37.3333},{"name":"Barafu Camp","lat":-3.0764,"lng":37.3486},{"name":"Uhuru Peak","lat":-3.0674,"lng":37.3556}]'::jsonb,
 array['January','February','June','July','August','September','October'],
 '2–12 climbers', false),

('30000000-0000-0000-0000-000000000004', 'masai-mara-amboseli-kenya-safari', 'Masai Mara & Amboseli Kenya Safari',
 array['20000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000009']::uuid[],
 array['Kenya'],
 'Six days pairing Amboseli''s elephant herds beneath Kilimanjaro with the Masai Mara''s legendary big-cat game viewing — Kenya''s two most famous reserves in one trip.',
 6, 2600, 3200, 'USD', 'mid-range', array['wildlife','family'],
 array['https://upload.wikimedia.org/wikipedia/commons/8/85/Safari_vehicles_watching_lion_couple_in_Maasai_Mara%2C_Kenya.jpg','https://upload.wikimedia.org/wikipedia/commons/3/35/Amboseli_Park_-_Kilimanjaro_elephant.jpg'],
 array['Elephant herds framed by Mount Kilimanjaro','Exceptional big-cat sightings in the Masai Mara','Maasai village cultural visit','Optional sunrise hot air balloon safari','Comfortable tented camps throughout'],
 '[{"day":1,"title":"Arrival Nairobi & Transfer to Amboseli","description":"Arrive in Nairobi and drive to Amboseli National Park, arriving in time for an afternoon game drive."},{"day":2,"title":"Amboseli Full Day","description":"Full day of game drives among Amboseli''s elephant herds, with Kilimanjaro as a backdrop weather permitting."},{"day":3,"title":"Transfer to Masai Mara","description":"Fly or drive to the Masai Mara, settling into camp for an afternoon game drive."},{"day":4,"title":"Full-Day Masai Mara Game Drive","description":"A full day tracking lion, cheetah and leopard across the Mara''s open grassland, with a picnic lunch out on the plains."},{"day":5,"title":"Mara River & Maasai Village","description":"Morning visit to the Mara River crossing points followed by an afternoon cultural visit to a local Maasai village."},{"day":6,"title":"Return to Nairobi","description":"Morning game drive before flying back to Nairobi for your onward departure."}]'::jsonb,
 '[{"name":"Nairobi","lat":-1.2921,"lng":36.8219},{"name":"Amboseli National Park","lat":-2.6520,"lng":37.2606},{"name":"Masai Mara","lat":-1.4061,"lng":35.0117}]'::jsonb,
 array['July','August','September','October','January','February'],
 '2–8 people', true),

('30000000-0000-0000-0000-000000000005', 'bwindi-gorilla-trekking-adventure', 'Bwindi Gorilla Trekking Adventure',
 array['20000000-0000-0000-0000-000000000012']::uuid[],
 array['Uganda'],
 'A focused four-day journey into Bwindi Impenetrable Forest for a face-to-face mountain gorilla trekking permit, paired with an optional Batwa cultural forest walk.',
 4, 2400, 2900, 'USD', 'luxury', array['gorilla','adventure'],
 array['https://upload.wikimedia.org/wikipedia/commons/3/38/Mountain_gorilla%2C_2-year-old%2C_Mubare_Group%2C_Buhoma%2C_Bwindi_Impenetrable_Forest%2C_Uganda.jpg','https://upload.wikimedia.org/wikipedia/commons/2/2f/Gorila_de_monta%C3%B1a_%28Gorilla_beringei_beringei%29%2C_parque_nacional_de_la_Selva_Impenetrable_de_Bwindi%2C_Uganda%2C_2024-02-02%2C_DD_51.jpg'],
 array['Face-to-face hour with a habituated gorilla family','Bwindi UNESCO World Heritage rainforest','Batwa pygmy cultural forest walk','Trekking permit and professional guide included','Small-group, low-impact tourism'],
 '[{"day":1,"title":"Arrival & Transfer to Bwindi","description":"Fly or drive from Entebbe/Kampala to the Bwindi region, arriving in time for a briefing on the following day''s trek."},{"day":2,"title":"Mountain Gorilla Trekking","description":"Early departure for gorilla trekking — trek duration varies with the family''s location, followed by an unforgettable hour observing the gorillas up close."},{"day":3,"title":"Batwa Cultural Walk","description":"Optional second gorilla trek or a guided Batwa pygmy forest walk learning traditional forest-dwelling skills and history."},{"day":4,"title":"Departure","description":"Morning at leisure before transfer back to Entebbe/Kampala for your onward flight."}]'::jsonb,
 '[{"name":"Bwindi Impenetrable Forest","lat":-1.0654,"lng":29.6285}]'::jsonb,
 array['June','July','August','September','December','January','February'],
 '1–6 people', true),

('30000000-0000-0000-0000-000000000006', 'volcanoes-rwanda-gorilla-golden-monkey-trek', 'Volcanoes Rwanda Gorilla & Golden Monkey Trek',
 array['20000000-0000-0000-0000-000000000015','20000000-0000-0000-0000-000000000016']::uuid[],
 array['Rwanda'],
 'Four days trekking Rwanda''s world-famous habituated gorilla families and golden monkeys in Volcanoes National Park, finished with a relaxed evening on the shores of Lake Kivu.',
 4, 3600, 4200, 'USD', 'luxury', array['gorilla','luxury'],
 array['https://upload.wikimedia.org/wikipedia/commons/d/de/Mountain_gorilla_from_Susa_Group_in_Karisimbi_thicket_of_Volcanoes_National_Park_in_Rwanda._Emmanuel_Kwizera.jpg','https://upload.wikimedia.org/wikipedia/commons/4/4d/Mist_over_Gorilla_Mountain_Rwanda_by_Bill_Hallier.jpg'],
 array['Trek Rwanda''s habituated gorilla families','Golden monkey trekking through bamboo forest','Scenic Virunga volcano landscapes','Luxury eco-lodge accommodation','Dian Fossey Gorilla Fund heritage site'],
 '[{"day":1,"title":"Arrival Kigali & Transfer to Musanze","description":"Arrive in Kigali and drive north to Musanze, at the foot of the Virunga volcanoes."},{"day":2,"title":"Mountain Gorilla Trekking","description":"Trek into Volcanoes National Park to spend a profound hour with a habituated mountain gorilla family."},{"day":3,"title":"Golden Monkey Trek & Lake Kivu","description":"Morning golden monkey trekking through the bamboo forest, then transfer to Lake Kivu for an evening of relaxation."},{"day":4,"title":"Departure","description":"Morning at leisure on Lake Kivu before transfer back to Kigali for departure."}]'::jsonb,
 '[{"name":"Volcanoes National Park","lat":-1.4833,"lng":29.5000},{"name":"Lake Kivu","lat":-1.9667,"lng":29.2667}]'::jsonb,
 array['June','July','August','September','December','January','February'],
 '1–6 people', false),

('30000000-0000-0000-0000-000000000007', 'safari-zanzibar-honeymoon-escape', 'Safari & Zanzibar Honeymoon Escape',
 array['20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000004']::uuid[],
 array['Tanzania','Zanzibar'],
 'Nine days pairing a private Serengeti and Ngorongoro safari with a beachfront villa in Zanzibar — champagne welcomes, sunset dhow dinners and total privacy throughout.',
 9, 4800, 6500, 'USD', 'luxury', array['honeymoon','luxury','wildlife','beach'],
 array['https://images.unsplash.com/photo-1756475471671-48813cf5ea5b','https://images.unsplash.com/photo-1778563624020-7c17cf564a3b'],
 array['Private luxury safari vehicle & guide throughout','Exclusive tented camps under canvas','Private beachfront villa in Zanzibar','Romantic sunset dhow cruise & private beach dinner','Honeymoon champagne welcome & spa treatment'],
 '[{"day":1,"title":"Arrival & Arusha","description":"Private transfer from Kilimanjaro Airport to a boutique lodge in Arusha, with a champagne welcome dinner."},{"day":2,"title":"Fly to the Serengeti","description":"Scenic light-aircraft transfer to a luxury tented camp in the Serengeti."},{"day":3,"title":"Private Serengeti Game Drive","description":"A full day of private game driving with a dedicated guide and vehicle, picnic lunch included."},{"day":4,"title":"Ngorongoro Crater","description":"Transfer to the Ngorongoro Highlands for a private crater-floor descent safari."},{"day":5,"title":"Fly to Zanzibar","description":"Morning flight to Zanzibar, transferring directly to your private beachfront villa."},{"day":6,"title":"Villa Day & Spa","description":"A full day to relax at your villa, with an in-villa couples spa treatment included."},{"day":7,"title":"Sunset Dhow & Private Dinner","description":"Private sunset dhow cruise followed by a candlelit dinner set up on the beach."},{"day":8,"title":"Free Day — Snorkeling or Relaxation","description":"Choose a private snorkeling excursion to Mnemba Atoll or simply enjoy the villa and beach."},{"day":9,"title":"Departure","description":"Private transfer to the airport for your onward flight."}]'::jsonb,
 '[{"name":"Arusha","lat":-3.3869,"lng":36.6830},{"name":"Serengeti National Park","lat":-2.3333,"lng":34.8333},{"name":"Ngorongoro Crater","lat":-3.2000,"lng":35.5000},{"name":"Zanzibar Beaches","lat":-5.7241,"lng":39.2986}]'::jsonb,
 array['June','July','August','September','October','December','January','February'],
 '2 people (private)', true),

('30000000-0000-0000-0000-000000000008', 'family-safari-tarangire-manyara-ngorongoro', 'Family Safari Adventure: Tarangire, Manyara & Ngorongoro',
 array['20000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000002']::uuid[],
 array['Tanzania'],
 'A seven-day northern circuit safari paced for families, combining Tarangire''s elephants, Lake Manyara''s tree-climbing lions and a Ngorongoro Crater descent with kid-friendly camps and a Maasai boma visit.',
 7, 3100, 3800, 'USD', 'mid-range', array['family','wildlife'],
 array['https://images.unsplash.com/photo-1710077539513-6d0b9cf273e2','https://images.unsplash.com/photo-1759129669580-e1e9ae3c078b'],
 array['Kid-friendly family tented camps with pools','Tree-climbing lions of Lake Manyara','Maasai boma cultural interaction','Flexible pacing suited to young travelers','Dedicated family-experienced safari guide'],
 '[{"day":1,"title":"Arrival & Family Briefing","description":"Arrive in Arusha and settle in with a relaxed family-friendly welcome briefing."},{"day":2,"title":"Tarangire National Park","description":"Game drive among Tarangire''s elephant herds and baobab trees, with a picnic lunch at a scenic viewpoint."},{"day":3,"title":"Lake Manyara","description":"Morning game drive in search of Lake Manyara''s famous tree-climbing lions, with an afternoon at the lodge pool."},{"day":4,"title":"Transfer to the Ngorongoro Highlands","description":"Scenic drive up into the Ngorongoro Highlands, arriving at your crater-rim lodge by afternoon."},{"day":5,"title":"Ngorongoro Crater Family Game Drive","description":"A full day descending into the crater for family-paced game viewing, with plenty of stops for questions and photos."},{"day":6,"title":"Maasai Boma Visit","description":"Guided cultural visit to a local Maasai boma, with the chance for kids to interact with the community."},{"day":7,"title":"Departure","description":"Return transfer to Arusha or Kilimanjaro Airport for your onward flight."}]'::jsonb,
 '[{"name":"Tarangire National Park","lat":-3.8330,"lng":35.8500},{"name":"Lake Manyara","lat":-3.3833,"lng":35.8167},{"name":"Ngorongoro Crater","lat":-3.2000,"lng":35.5000}]'::jsonb,
 array['June','July','August','December','January'],
 '2–10 people', false),

('30000000-0000-0000-0000-000000000009', 'ultimate-luxury-east-africa', 'Ultimate Luxury East Africa: Serengeti, Zanzibar & Kilimanjaro',
 array['20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000005']::uuid[],
 array['Tanzania','Zanzibar'],
 'A fully private 14-day flagship journey through the Kilimanjaro foothills, a Serengeti and Ngorongoro fly-in safari with a hot air balloon sunrise, and a beach finale in Zanzibar — Golden Tours'' most complete circuit.',
 14, 9500, 13000, 'USD', 'luxury', array['luxury','wildlife','beach','culture'],
 array['https://upload.wikimedia.org/wikipedia/commons/b/b5/Lobo_Lodge%2C_Serengeti%2C_Tanzania.jpg','https://upload.wikimedia.org/wikipedia/commons/3/37/Balloons_over_Maasai_Mara%2C_Kenya%2C_looking_south_toward_Serengeti.jpg'],
 array['14-day fully private luxury circuit','Hot air balloon safari over the Serengeti','5-star lodges and a private beach villa throughout','One dedicated private guide for the entire journey','Bespoke itinerary adjustments available on request'],
 '[{"day":1,"title":"Arrival — Kilimanjaro Foothills","description":"Arrive at Kilimanjaro Airport and transfer to a luxury lodge at the mountain''s foothills."},{"day":2,"title":"Coffee Estate & Foothill Hike","description":"A gentle day hike on Kilimanjaro''s lower slopes followed by a private coffee estate tour and tasting."},{"day":3,"title":"Fly to the Serengeti","description":"Private light-aircraft transfer to an exclusive mobile camp deep in the Serengeti."},{"day":4,"title":"Private Serengeti Game Drives","description":"A full day of private game driving tracking the Great Migration herds with your dedicated guide."},{"day":5,"title":"Serengeti Continued","description":"A second full day exploring different regions of the Serengeti ecosystem for varied wildlife encounters."},{"day":6,"title":"Hot Air Balloon Safari","description":"Sunrise hot air balloon flight over the Serengeti plains, followed by a bush champagne breakfast."},{"day":7,"title":"Fly to Ngorongoro Highlands","description":"Transfer to a lodge perched on the Ngorongoro Crater rim."},{"day":8,"title":"Ngorongoro Crater Private Safari","description":"Full private descent into the crater floor for exceptional wildlife density and a strong chance of black rhino."},{"day":9,"title":"Fly to Zanzibar","description":"Scenic flight to Zanzibar, transferring to your private beach villa."},{"day":10,"title":"Stone Town Private Tour","description":"A private guided heritage tour through Stone Town''s old town and spice market."},{"day":11,"title":"Beach Villa & Water Sports","description":"A free day at the villa with optional snorkeling, paddleboarding or diving excursions."},{"day":12,"title":"Beach Villa & Spa","description":"A restorative day of spa treatments and beach relaxation."},{"day":13,"title":"Private Sunset Dhow & Farewell Dinner","description":"A private sunset dhow cruise followed by a farewell dinner set on the sand."},{"day":14,"title":"Departure","description":"Private transfer to the airport for your onward flight."}]'::jsonb,
 '[{"name":"Kilimanjaro Foothills","lat":-3.0674,"lng":37.3556},{"name":"Serengeti National Park","lat":-2.3333,"lng":34.8333},{"name":"Ngorongoro Crater","lat":-3.2000,"lng":35.5000},{"name":"Stone Town","lat":-6.1659,"lng":39.1990},{"name":"Zanzibar Beaches","lat":-5.7241,"lng":39.2986}]'::jsonb,
 array['June','July','August','September','December','January','February'],
 '2–6 people (private)', true),

('30000000-0000-0000-0000-000000000010', 'maasai-culture-rift-valley-discovery', 'Maasai Culture & Rift Valley Discovery',
 array['20000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000002']::uuid[],
 array['Tanzania'],
 'A five-day cultural immersion through the Great Rift Valley, including an authentic Maasai boma homestay, a multi-tribal village walk at Mto wa Mbu, and a Lake Manyara game drive.',
 5, 1650, 2100, 'USD', 'budget', array['culture','adventure'],
 array['https://upload.wikimedia.org/wikipedia/commons/3/3f/Ngorongoro%2C_Tanzania_-_Maasai_people.jpg'],
 array['Authentic Maasai boma homestay','Mto wa Mbu multi-tribal village walk','Great Rift Valley escarpment views','Community-guide led throughout','Directly supports community-based tourism'],
 '[{"day":1,"title":"Arrival & Cultural Heritage Centre","description":"Arrive in Arusha and visit the Cultural Heritage Centre to learn about Tanzania''s art, history and tribes."},{"day":2,"title":"Mto wa Mbu Village Walk","description":"Guided walking tour through Mto wa Mbu, a multi-tribal farming village at the base of the Rift Valley escarpment."},{"day":3,"title":"Lake Manyara Game Drive","description":"A game drive through Lake Manyara National Park in search of tree-climbing lions and flamingos."},{"day":4,"title":"Maasai Boma Homestay","description":"Overnight homestay experience in a traditional Maasai boma in the Ngorongoro Highlands, including a cultural evening."},{"day":5,"title":"Rift Valley Viewpoint & Departure","description":"Stop at a scenic Rift Valley viewpoint on the return drive before your onward departure."}]'::jsonb,
 '[{"name":"Mto wa Mbu","lat":-3.3500,"lng":35.8500},{"name":"Lake Manyara","lat":-3.3833,"lng":35.8167}]'::jsonb,
 array['June','July','August','September','December','January'],
 '2–12 people', false),

('30000000-0000-0000-0000-000000000011', 'uganda-adventure-murchison-chimpanzee', 'Uganda Adventure: Murchison Falls & Chimpanzee Trekking',
 array['20000000-0000-0000-0000-000000000013']::uuid[],
 array['Uganda'],
 'Six days combining chimpanzee trekking in Budongo Forest with boat and game-drive exploration of Murchison Falls National Park, home to the Nile''s most dramatic waterfall.',
 6, 2100, 2700, 'USD', 'mid-range', array['adventure','wildlife'],
 array['https://upload.wikimedia.org/wikipedia/commons/7/76/Murchison_Falls%2C_Nile%2C_Uganda_%2817052663192%29.jpg'],
 array['Chimpanzee trekking in Budongo Forest','Boat cruise to the base of Murchison Falls','Nile River top-of-the-falls hike','Big game drives on the Nile''s northern bank','Uganda''s most powerful waterfall'],
 '[{"day":1,"title":"Arrival & Transfer","description":"Arrive in Entebbe and drive to the Murchison Falls region, arriving by evening."},{"day":2,"title":"Chimpanzee Trekking","description":"Morning chimpanzee trekking in Budongo Forest Reserve, tracking one of Uganda''s largest habituated chimp communities."},{"day":3,"title":"Boat Safari to the Falls","description":"A boat cruise up the Victoria Nile to the base of Murchison Falls, spotting hippo, crocodile and elephant along the banks."},{"day":4,"title":"Top of the Falls Hike","description":"Hike to the top of the falls to see the Nile forced through its narrow 7-metre gorge, followed by an afternoon game drive."},{"day":5,"title":"Full-Day Game Drive","description":"A full day exploring the northern savannah for lion, giraffe and large elephant herds."},{"day":6,"title":"Return to Entebbe","description":"Morning drive back to Entebbe for your onward departure."}]'::jsonb,
 '[{"name":"Murchison Falls National Park","lat":2.2833,"lng":31.6833},{"name":"Budongo Forest Reserve","lat":1.7500,"lng":31.5667}]'::jsonb,
 array['December','January','February','June','July','August','September'],
 '2–10 people', false),

('30000000-0000-0000-0000-000000000012', 'kenya-tanzania-grand-safari-circuit', 'Kenya–Tanzania Grand Safari Circuit',
 array['20000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002']::uuid[],
 array['Kenya','Tanzania'],
 'A ten-day cross-border safari following the Mara-Serengeti ecosystem from Amboseli''s elephants through the Masai Mara into the Serengeti and Ngorongoro Crater — with all border logistics handled for you.',
 10, 4200, 5400, 'USD', 'luxury', array['wildlife','adventure','luxury'],
 array['https://upload.wikimedia.org/wikipedia/commons/b/b8/Safari_in_The_Maasai_Mara_%2843837384641%29.jpg','https://upload.wikimedia.org/wikipedia/commons/0/0d/Wildebeest_migration_%287513594286%29.jpg'],
 array['Two-country safari across the Mara-Serengeti ecosystem','Follow the Great Migration across the Kenya-Tanzania border','Amboseli''s elephant herds beneath Kilimanjaro','Ngorongoro Crater''s dense wildlife concentration','Cross-border logistics fully handled by Golden Tours'],
 '[{"day":1,"title":"Arrival Nairobi","description":"Arrive in Nairobi and transfer to your hotel for the night."},{"day":2,"title":"Amboseli National Park","description":"Drive to Amboseli for an afternoon game drive among elephant herds beneath Kilimanjaro."},{"day":3,"title":"Amboseli Sunrise Game Drive","description":"Early game drive for the best light on Kilimanjaro before continuing wildlife viewing."},{"day":4,"title":"Transfer to the Masai Mara","description":"Fly or drive to the Masai Mara, settling into camp for an evening game drive."},{"day":5,"title":"Full-Day Masai Mara","description":"A full day tracking the Mara''s resident big cats and, in season, migration herds."},{"day":6,"title":"Cross-Border to the Serengeti","description":"Overland transfer across the Kenya-Tanzania border (via Isebania/Sirari) into the Serengeti ecosystem."},{"day":7,"title":"Serengeti Game Drives","description":"A full day of game driving in the Serengeti, tracking the migration''s current location."},{"day":8,"title":"Serengeti Continued","description":"A second day exploring different regions of the Serengeti for varied wildlife and scenery."},{"day":9,"title":"Ngorongoro Crater","description":"Transfer to Ngorongoro for a full descent into the crater floor."},{"day":10,"title":"Departure","description":"Transfer to Kilimanjaro International Airport for your onward flight."}]'::jsonb,
 '[{"name":"Amboseli National Park","lat":-2.6520,"lng":37.2606},{"name":"Masai Mara","lat":-1.4061,"lng":35.0117},{"name":"Serengeti National Park","lat":-2.3333,"lng":34.8333},{"name":"Ngorongoro Crater","lat":-3.2000,"lng":35.5000}]'::jsonb,
 array['July','August','September','October'],
 '2–8 people', false);

-- ============================================================
-- 4. BOOKINGS
-- ============================================================
insert into public.bookings (id, user_id, package_id, travelers, start_date, status, total_price, currency, notes, created_at) values
('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001',2,'2025-09-10','completed',5700,'USD',null, now() - interval '330 days'),
('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000009',2,'2026-11-05','pending',19000,'USD','Celebrating our 10th wedding anniversary.', now() - interval '20 days'),
('40000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002',1,'2025-12-20','completed',1450,'USD',null, now() - interval '260 days'),
('40000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000010',2,'2026-09-15','confirmed',3300,'USD',null, now() - interval '15 days'),
('40000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000007',2,'2026-10-01','confirmed',9600,'USD','Honeymoon trip — would love a cake in the villa on arrival.', now() - interval '40 days'),
('40000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000008',5,'2026-12-18','pending',15500,'USD','Traveling with two children aged 8 and 11.', now() - interval '8 days'),
('40000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000004',4,'2025-07-01','completed',10400,'USD',null, now() - interval '410 days'),
('40000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000005',1,'2026-02-14','completed',2400,'USD',null, now() - interval '190 days'),
('40000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000006',1,'2026-09-20','pending',3600,'USD',null, now() - interval '5 days'),
('40000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000009',2,'2026-01-10','completed',19000,'USD',null, now() - interval '250 days'),
('40000000-0000-0000-0000-000000000011','10000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000003',1,'2026-08-25','confirmed',2200,'USD',null, now() - interval '12 days'),
('40000000-0000-0000-0000-000000000012','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000011',3,'2025-05-05','cancelled',6300,'USD','Rescheduled due to a family emergency.', now() - interval '460 days'),
('40000000-0000-0000-0000-000000000013','10000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000012',2,'2027-01-15','pending',8400,'USD',null, now() - interval '3 days'),
('40000000-0000-0000-0000-000000000014','10000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000002',5,'2026-12-01','pending',7250,'USD','Extended family trip — 5 adults.', now() - interval '2 days');

-- ============================================================
-- 5. PAYMENTS
-- ============================================================
insert into public.payments (id, booking_id, amount, currency, method, status, paid_at, created_at) values
('50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',5700,'USD','card','paid','2025-09-01', now() - interval '330 days'),
('50000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003',1450,'USD','mobile_money','paid','2025-12-05', now() - interval '260 days'),
('50000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000004',3300,'USD','card','paid', now() - interval '10 days', now() - interval '14 days'),
('50000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000005',9600,'USD','bank_transfer','paid', now() - interval '35 days', now() - interval '38 days'),
('50000000-0000-0000-0000-000000000005','40000000-0000-0000-0000-000000000007',10400,'USD','card','paid','2025-06-20', now() - interval '410 days'),
('50000000-0000-0000-0000-000000000006','40000000-0000-0000-0000-000000000008',2400,'USD','card','paid','2026-01-30', now() - interval '190 days'),
('50000000-0000-0000-0000-000000000007','40000000-0000-0000-0000-000000000010',19000,'USD','bank_transfer','paid','2025-12-20', now() - interval '250 days'),
('50000000-0000-0000-0000-000000000008','40000000-0000-0000-0000-000000000011',2200,'USD','card','paid', now() - interval '9 days', now() - interval '11 days'),
('50000000-0000-0000-0000-000000000009','40000000-0000-0000-0000-000000000002',19000,'USD','card','pending',null, now() - interval '19 days'),
('50000000-0000-0000-0000-000000000010','40000000-0000-0000-0000-000000000006',15500,'USD','mobile_money','pending',null, now() - interval '7 days'),
('50000000-0000-0000-0000-000000000011','40000000-0000-0000-0000-000000000009',3600,'USD','card','pending',null, now() - interval '4 days'),
('50000000-0000-0000-0000-000000000012','40000000-0000-0000-0000-000000000012',6300,'USD','card','refunded','2025-04-20', now() - interval '460 days'),
('50000000-0000-0000-0000-000000000013','40000000-0000-0000-0000-000000000013',2500,'USD','card','pending',null, now() - interval '3 days'),
('50000000-0000-0000-0000-000000000014','40000000-0000-0000-0000-000000000014',7250,'USD','mobile_money','pending',null, now() - interval '2 days');

-- ============================================================
-- 6. REVIEWS
-- ============================================================
insert into public.reviews (id, user_id, package_id, booking_id, rating, comment, created_at) values
('60000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',5,'The Ngorongoro Crater descent alone was worth the trip — we saw three rhino in one morning. Our guide Emmanuel knew exactly where to position the vehicle for every sighting. Tarangire''s baobabs were an unexpected highlight too.', now() - interval '310 days'),
('60000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000003',5,'Stone Town was so much richer with a local guide explaining the door carvings and spice trade history. Nungwi''s water was unbelievably calm and clear — snorkeling at Mnemba was the best I''ve done anywhere.', now() - interval '245 days'),
('60000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0000-000000000007',4,'Amboseli''s elephant herds with Kilimanjaro behind them are exactly as photogenic as advertised. Mara game viewing was fantastic too, though our second camp had some wifi issues. Would book again for the wildlife alone.', now() - interval '395 days'),
('60000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0000-000000000008',5,'Nothing prepares you for sitting three metres from a silverback in the wild. Our trek was steep and muddy but completely worth it. The Batwa cultural walk the next day added real context to the region''s history.', now() - interval '175 days'),
('60000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0000-000000000010',5,'Fourteen days, zero logistics stress — every flight, transfer and lodge was seamless. The hot air balloon sunrise over the Serengeti is a memory I''ll keep forever. Worth every dollar for a honeymoon-caliber trip.', now() - interval '235 days');

-- ============================================================
-- 7. ENQUIRIES / LEADS
-- ============================================================
insert into public.enquiries (id, user_id, name, email, phone, message, source, status, created_at) values
('70000000-0000-0000-0000-000000000001', null, 'Grace Thompson', 'grace.thompson@example.com', '+1 312 555 0110', 'Hi, we''re a family of four looking at a safari for this coming December — kids are 9 and 12. What would you recommend that''s not too intense for them?', 'contact_form', 'new', now() - interval '4 days'),
('70000000-0000-0000-0000-000000000002', null, 'David Kim', 'david.kim@example.com', '+1 646 555 0193', 'Trying to decide between a Zanzibar-only honeymoon or combining it with a short safari. Budget is around $8,000 total for two people, 8-9 days.', 'contact_form', 'contacted', now() - interval '11 days'),
('70000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006', 'Chen Wei', 'chen.wei@example.com', '+65 8123 4567', 'Asked the AI assistant about gorilla trekking permit costs in Uganda vs Rwanda and was pointed to the Bwindi Gorilla Trekking Adventure package.', 'ai_chat', 'converted', now() - interval '195 days'),
('70000000-0000-0000-0000-000000000004', null, 'Fatima Al-Sayed', 'fatima.alsayed@example.com', '+971 50 555 0176', 'What kind of fitness level do I need for the Kilimanjaro Machame route? I run occasionally but have never done multi-day trekking.', 'contact_form', 'new', now() - interval '2 days'),
('70000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'James Whitfield', 'james.whitfield@example.com', '+1 415 555 0182', 'New booking request for "Ultimate Luxury East Africa: Serengeti, Zanzibar & Kilimanjaro" — 2 traveler(s), starting 2026-11-05.', 'planner', 'contacted', now() - interval '20 days'),
('70000000-0000-0000-0000-000000000006', null, 'Robert Njoroge', 'robert.njoroge@example.com', '+254 722 555 019', 'Corporate group of 12 people interested in a wildlife safari but our budget caps at $1,200 per person for 5 days — is that realistic for the Mara?', 'contact_form', 'closed', now() - interval '55 days');

-- ============================================================
-- 8. AI CONVERSATIONS + MESSAGES
-- ============================================================
insert into public.conversations (id, user_id, title, created_at) values
('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Gorilla trekking permit costs?', now() - interval '196 days'),
('80000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Best month for Zanzibar and Maasai culture trip', now() - interval '250 days');

insert into public.messages (id, conversation_id, role, content, created_at) values
('90000000-0000-0000-0000-000000000001','80000000-0000-0000-0000-000000000001','user','What''s the difference between gorilla trekking in Uganda vs Rwanda?', now() - interval '196 days'),
('90000000-0000-0000-0000-000000000002','80000000-0000-0000-0000-000000000001','assistant','Great question. The gorillas and experience are similarly extraordinary in both countries, but there are real differences: Uganda''s Bwindi Impenetrable Forest permits cost around $800, while Rwanda''s Volcanoes National Park permits run about $1,500. Rwanda''s treks also tend to be shorter and less physically demanding since the gorilla families are closer to the trailheads, while Bwindi''s terrain is steeper and more remote. Rwanda pairs beautifully with Lake Kivu afterward; Uganda pairs well with Murchison Falls or chimpanzee trekking in Budongo Forest. Which matters more to you — budget or convenience?', now() - interval '196 days'),
('90000000-0000-0000-0000-000000000003','80000000-0000-0000-0000-000000000001','user','I have $3000 budget for 4 days, solo traveler. Which works better?', now() - interval '196 days'),
('90000000-0000-0000-0000-000000000004','80000000-0000-0000-0000-000000000001','assistant','With a $3,000 budget for 4 days as a solo traveler, Uganda is the better fit. Our Bwindi Gorilla Trekking Adventure runs $2,400–$2,900 for 4 days, including your trekking permit, guide, transfers and a Batwa cultural forest walk — comfortably inside your budget. Rwanda''s equivalent trip runs $3,600+ due to the higher permit cost, which would stretch you thin. I''d recommend booking the Bwindi package and using the savings toward a Lake Kivu add-on another time.', now() - interval '196 days'),

('90000000-0000-0000-0000-000000000005','80000000-0000-0000-0000-000000000002','user','I want to combine Zanzibar beaches with something cultural, 5-6 days, for two people, mid-range budget. Best month?', now() - interval '250 days'),
('90000000-0000-0000-0000-000000000006','80000000-0000-0000-0000-000000000002','assistant','That points directly to our Zanzibar Beach & Stone Town Escape — 5 days, $1,450–$1,950 per person, which is exactly mid-range for two travelers. It pairs Stone Town''s UNESCO old town, a spice farm tour and a dhow sunset cruise with beach time in Nungwi. For the best conditions, aim for June–October or December–February — those months avoid the April–May long rains and give you the calmest, clearest water for snorkeling at Mnemba Atoll. Want me to check availability for a specific week?', now() - interval '250 days');
