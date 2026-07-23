import { IMAGES } from '../utils/constants';

export const projectsData = [
  {
    id: 1,
    title: 'Summer House',
    location: 'Dubai, UAE',
    type: 'Residential Villa',
    description: `A serene lakeside villa designed for family living, where architecture meets nature. Open layouts, natural light, and premium finishes create a timeless retreat.`,
    category: 'residential',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 2-6:
    //   [0]=hero, then rows of 3 (large + 2 stacked, alternating left/right)
    images: [
      '/assets/images/projects/01_summer-house/1.webp',   // hero (pool exterior)
      // Row 1 (--left):  large + stack right
      '/assets/images/projects/01_summer-house/2.webp',   // large L: angled house
      '/assets/images/projects/01_summer-house/3.webp',   // top R:  firepit garden
      '/assets/images/projects/01_summer-house/4.webp',   // bot R:  wooden-slat house
      // Row 2 (--right): stack left + large right
      '/assets/images/projects/01_summer-house/7.webp',   // large R: pool horizontal
      '/assets/images/projects/01_summer-house/5.webp',   // top L:  front elevation + cars
      '/assets/images/projects/01_summer-house/6.webp',   // bot L:  palm walkway
      // Row 3 (--left):  large + stack right  (PDF page 5)
      '/assets/images/projects/01_summer-house/8.webp',   // large L: dining
      '/assets/images/projects/01_summer-house/12.webp',  // top R:  living w/ round chandelier
      '/assets/images/projects/01_summer-house/10.webp',  // bot R:  kitchen bar
      // Row 4 (--right): stack left + large right  (PDF page 6)
      '/assets/images/projects/01_summer-house/13.webp',  // large R: TV living
      '/assets/images/projects/01_summer-house/11.webp',  // top L:  skylight hallway
      '/assets/images/projects/01_summer-house/9.webp',   // bot L:  foyer
    ]
  },
  {
    id: 2,
    title: 'The Ultima',
    location: 'Dubai, UAE',
    type: 'Architecture, Landscape & Interiors',
    description: `An ultra-luxury residence combining bold architectural expression with refined interiors. From grand kitchens to intimate bedrooms, every detail speaks of craftsmanship.`,
    category: 'residential',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 9-14, one row per PDF page.
    layouts: ['left', 'right', 'left', 'right', 'left'],
    images: [
      '/assets/images/projects/02_The-Ultima/Architecture-Landscape/U_1.webp',   // hero (page 9): front elevation w/ cars
      // Row 0 --left  (page 10): exterior + patio
      '/assets/images/projects/02_The-Ultima/Architecture-Landscape/U_2.webp',   // large L: wide-angle patio lounge
      '/assets/images/projects/02_The-Ultima/Architecture-Landscape/U_3.webp',   // top R:   corner angle house w/ car
      '/assets/images/projects/02_The-Ultima/Architecture-Landscape/U_4.webp',   // bot R:   pool w/ white sofas
      // Row 1 --right (page 11): main living
      '/assets/images/projects/02_The-Ultima/Interiors/U_7.webp',                // large R: TV entertainment room (dark walls)
      '/assets/images/projects/02_The-Ultima/Interiors/U_5.webp',                // top L:   living w/ brown ottoman
      '/assets/images/projects/02_The-Ultima/Interiors/U_6.webp',                // bot L:   bonsai in glass display
      // Row 2 --left  (page 12): dining + corridor
      '/assets/images/projects/02_The-Ultima/Interiors/U_8.webp',                // large L: wide dining w/ chandelier
      '/assets/images/projects/02_The-Ultima/Interiors/U_9.webp',                // top R:   round dining table
      '/assets/images/projects/02_The-Ultima/Interiors/U_10.webp',               // bot R:   corridor to garden
      // Row 3 --right (page 13): dramatic staircase (large) + corridor & bonsai reprised
      '/assets/images/projects/02_The-Ultima/Interiors/U_11.webp',               // large R: floating staircase w/ art wall
      '/assets/images/projects/02_The-Ultima/Interiors/U_10.webp',               // top L:   corridor (reprise of row 2 bot R)
      '/assets/images/projects/02_The-Ultima/Interiors/U_6.webp',                // bot L:   bonsai display (reprise of row 1 bot L)
      // Row 4 --left  (page 14): kitchen suite
      '/assets/images/projects/02_The-Ultima/Interiors/KITCHEN%201.webp',        // large L: kitchen w/ marble range hood
      '/assets/images/projects/02_The-Ultima/Interiors/KITCHEN%203.webp',        // top R:   counter w/ jars
      '/assets/images/projects/02_The-Ultima/Interiors/KITCHEN%205.webp',        // bot R:   kitchen close-up
    ]
  },
  {
    id: 3,
    title: 'Mansion 27',
    location: 'Dubai, UAE',
    type: 'Residential — Interior Design',
    description: `A contemporary mansion showcasing bespoke interior design across bedrooms and private offices. Rich materials and dramatic lighting define each space.`,
    category: 'residential',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 16-21.
    // Hero swapped with slide-1 top-R per feedback (was '4 2', now '3 2').
    layouts: ['left', 'right', 'left', 'right', 'left'],
    // Bias portrait/bookshelf shots to their subject so the meaningful content
    // fills the near-square grid cell.
    focus: {
      12: 'center bottom', // KALPESH 4 (1) tall portrait — anchor to coffee-table/sofa subject
      15: 'center top',    // OFFICE 2 shelving detail portrait (zoomed out via fit: contain)
    },
    // Slide 4 large-R (curved sofa) kept as contain so the whole frame shows;
    // the two left images (top-L KALPESH 6 square bookshelf, bot-L KALPESH 4(1)
    // portrait) now use default cover with tuned object-position so they fill
    // the grid cell like the other rows.
    // Slide 5 top-R (OFFICE 2 shelving) set to contain so it zooms out and
    // shows a wider portion of the portrait shelving detail.
    fit: {
      10: 'contain',   // KALPESH 5 curved sofa (large R)
      15: 'contain',   // OFFICE 2 shelving (top R) — zoom out
    },
    images: [
      '/assets/images/projects/03_Mansion-27/Architecture%20Landscape%20/3%202.webp',   // hero (page 16): swapped in from slide-1 top-R
      // Row 0 --left (page 17): architecture exteriors
      '/assets/images/projects/03_Mansion-27/Architecture%20Landscape%20/2%202.webp',   // large L: wide house exterior day
      '/assets/images/projects/03_Mansion-27/Architecture%20Landscape%20/4%202.webp',   // top R:   corridor / palms (swapped in from hero)
      '/assets/images/projects/03_Mansion-27/Architecture%20Landscape%20/1%202.webp',   // bot R:   house compact view
      // Row 1 --right (page 18): master bedroom
      '/assets/images/projects/03_Mansion-27/Interior%20/KALPESH%202.webp',              // large R: master bedroom w/ art wall
      '/assets/images/projects/03_Mansion-27/Interior%20/KALPESH%203.webp',              // top L:   living small w/ accent wall
      '/assets/images/projects/03_Mansion-27/Interior%20/KALPESH%208.webp',              // bot L:   dark-wall interior
      // Row 2 --left (page 19): walk-in wardrobe
      '/assets/images/projects/03_Mansion-27/Interior%20/01%20-%20Mithlis%20Bedroom_View%2008.webp',  // large L: walk-in wardrobe
      '/assets/images/projects/03_Mansion-27/Interior%20/01%20-%20Mithlis%20Bedroom_View%2006.webp',  // top R:   wardrobe detail
      '/assets/images/projects/03_Mansion-27/Interior%20/01%20-%20Mithlis%20Bedroom_View%2007.webp',  // bot R:   wardrobe alt
      // Row 3 --right (page 20): curved sofa lounge (portrait bookshelf)
      '/assets/images/projects/03_Mansion-27/Interior%20/KALPESH%205.webp',              // large R: curved boucle sofa
      '/assets/images/projects/03_Mansion-27/Interior%20/KALPESH%206.webp',              // top L:   bookshelf detail (portrait)
      '/assets/images/projects/03_Mansion-27/Interior%20/KALPESH%204%20(1).webp',        // bot L:   sofa alt view
      // Row 4 --left (page 21): office (portrait shelving)
      '/assets/images/projects/03_Mansion-27/Interior%20/OFFICE%203.webp',               // large L: office desk w/ car outside
      '/assets/images/projects/03_Mansion-27/Interior%20/OFFICE%205.webp',               // top R:   office cream sofa
      '/assets/images/projects/03_Mansion-27/Interior%20/OFFICE%202.webp',               // bot R:   office shelving detail (portrait)
    ]
  },
  {
    id: 4,
    title: 'The Desert Bloom',
    location: 'Dubai, UAE',
    type: 'Residential Villa',
    description: `A desert-inspired villa where exterior architecture blooms into thoughtfully designed interiors \u2014 from kids\u2019 rooms to powder rooms, each space tells its own story.`,
    category: 'residential',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 23-28, plus feedback fixes:
    //   1) slide-1 top-R and slide-2 large-R were mis-swapped (Kids 05 <-> Kids 06)
    //   2) slide 1 rotated clockwise: [LL,TR,BR] -> [BR,LL,TR]
    //   3) slide 4 rotated clockwise: [LR,TL,BL] -> [TL,BL,LR]
    layouts: ['left', 'right', 'left', 'right', 'left'],
    focus: {
      15: 'center bottom',   // Powder Room View 02 (NEW, bot R) — show toilet
    },
    images: [
      '/assets/images/projects/04_The-Desert-Bloom/Architecture%20Landscape%20/FRONT_With%20boundary.webp',           // hero (page 23): villa exterior w/ palm trees
      // Slide 1 --left (page 24 bedroom main) — clockwise-rotated
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/09%20-%20Future%20Kids%20Room_View%2003.webp',        // large L: bedroom chair (was bot R)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/09%20-%20Future%20Kids%20Room_View%2002.webp',        // top R:   master bedroom w/ sofa (was large L)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/09%20-%20Future%20Kids%20Room_View%2006.webp',        // bot R:   sculpture / art wall (swapped in from slide 2)
      // Slide 2 --right (page 25 bedroom alt) — with new nightstand
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/09%20-%20Future%20Kids%20Room_View%2005.webp',        // large R: bedroom art wall alt (swapped in from slide 1 top R)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/09%20-%20Future%20Kids%20Room_View%2001.webp',        // top L:   bed w/ two lamps
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/01%20-%20Bedroom_Nightstand-Detail.webp',             // bot L:   NEW nightstand close-up (from 1.png)
      // Slide 3 --left  (page 26 wardrobe main)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/17%20-%20Mithils%20WIW_View%2003.jpg.webp',           // large L: walk-in island w/ jewelry
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/17%20-%20Mithils%20WIW_View%2004.jpg.webp',           // top R:   circular mirror vanity
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/17%20-%20Mithils%20WIW_View%2002.jpg.webp',           // bot R:   wardrobe lower / staircase view
      // Slide 4 --right (page 27 wardrobe alt) — clockwise-rotated
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/17%20-%20Mithils%20WIW_View%2007.jpg.webp',           // large R: overhead wardrobe (was top L)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/17%20-%20Mithils%20WIW_View%2008.jpg.webp',           // top L:   wardrobe detail (was bot L)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/17%20-%20Mithils%20WIW_View%2006.jpg.webp',           // bot L:   long wardrobe corridor (was large R)
      // Slide 5 --left  (page 28 powder room)
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/02%20-%20Powder%20Room_View%2001.webp',               // large L: wide powder w/ cross-tile
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/02%20-%20Powder%20Room_View%2003.webp',               // top R:   round mirror close-up
      '/assets/images/projects/04_The-Desert-Bloom/Interiors%20/02%20-%20Powder%20Room_View%2002.webp',               // bot R:   NEW toilet in marble (crop bottom via focus)
    ]
  },
  {
    id: 5,
    title: '99 Priv\u00e9',
    location: 'Mumbai, India',
    type: 'Architecture & Interiors',
    description: `A private residence merging formal dining elegance with festive warmth. Architecture and interiors come together in a celebration of refined living.`,
    category: 'residential',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 30-35, plus feedback fixes:
    //   1) hero and slide-1 large-L swapped (FD 01 <-> FD 03)
    //   2) slide 1 rotated anti-clockwise: [LL,TR,BR] -> [TR,BR,LL]
    //   3) slide 3 grid corrected from --half to --right (PDF page 33 is --right)
    //      Xmas 02 (stairs) appears on both page 32 and 33 in PDF, so it's used twice.
    layouts: ['left', 'right', 'right', 'half', 'left'],
    images: [
      '/assets/images/projects/05_99-Prive/Interior%20/07%20-%20Formal%20Dining_View%2003.webp',        // hero (page 30): long dining table overhead (swapped in from slide 1 large-L)
      // Slide 1 --left (page 31 dining alt) — anticlockwise-rotated
      '/assets/images/projects/05_99-Prive/Interior%20/07%20-%20Formal%20Dining_View%2006.webp',        // large L: round dining table (was top R)
      '/assets/images/projects/05_99-Prive/Interior%20/07%20-%20Formal%20Dining_View%2002.webp',        // top R:   dining w/ round chandelier (was bot R)
      '/assets/images/projects/05_99-Prive/Interior%20/07%20-%20Formal%20Dining_View%2001.webp',        // bot R:   cherry blossom dining (was hero)
      // Slide 2 --right (page 32 christmas main)
      '/assets/images/projects/05_99-Prive/Christmas/20%20-%20Living%20Area%20Xmas_View%2004.webp',    // large R: big Christmas tree
      '/assets/images/projects/05_99-Prive/Christmas/20%20-%20Living%20Area%20Xmas_View%2002.webp',    // top L:   stairs w/ garland
      '/assets/images/projects/05_99-Prive/Christmas/20%20-%20Living%20Area%20Xmas_View%2003.webp',    // bot L:   tree w/ plants
      // Slide 3 --right (page 33 dining/bar alt — 3-image grid per PDF)
      '/assets/images/projects/05_99-Prive/Christmas/20%20-%20Living%20Area%20Xmas_View%2012.webp',    // large R: dining table w/ flower chandelier
      '/assets/images/projects/05_99-Prive/Christmas/20%20-%20Living%20Area%20Xmas_View%2002.webp',    // top L:   stairs (reprise — also appears on page 33)
      '/assets/images/projects/05_99-Prive/Christmas/20%20-%20Living%20Area%20Xmas_View%2011.webp',    // bot L:   bar w/ chandelier
      // Slide 4 --half (page 34 powder room — 2 side by side)
      '/assets/images/projects/05_99-Prive/Interior%20/1%20(1).webp',                                    // left:  powder round mirror + lamps
      '/assets/images/projects/05_99-Prive/Interior%20/2%20(1).webp',                                    // right: powder round mirror alt
      // Slide 5 --left  (page 35 architecture)
      '/assets/images/projects/05_99-Prive/Architecture%20/AJV%20Villa%20Front%20View.webp',            // large L: villa wide exterior
      '/assets/images/projects/05_99-Prive/Architecture%20/AJV%20Villa%20Front%20Perspective.webp',    // top R:   villa angled view
      '/assets/images/projects/05_99-Prive/Architecture%20/AJV%20Villa%2004.webp',                      // bot R:   villa close-up
    ]
  },
  {
    id: 6,
    title: 'The Edge',
    location: 'Dubai, UAE',
    type: 'Residential — Interior Design',
    description: `A cutting-edge residential interior featuring dramatic living spaces, custom staircases, and luxurious bedrooms with walk-in wardrobes.`,
    category: 'residential',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 37-42, plus feedback fixes:
    //   1) slide 1 large-L <-> bot-R swapped (12-GG overhead <-> 9-GG sectional)
    //      so page-38 large-L is the sectional view like the PDF
    //   2) slide 2 large-R <-> top-L swapped (STAIRCASE <-> LIFT) so page-39
    //      large-R is the modern hallway/foyer
    //   3) slide 1 rotated clockwise per feedback: [LL,TR,BR] -> [BR,LL,TR]
    //   4) NEW slide 4 (--left page 41 walk-in wardrobe) added — this is the
    //      slide that was missing vs the PDF. WALK IN 3 as large-L, WALK IN 1
    //      reused as top-R (same walk-in shown twice in PDF), and GUEST BEDROOM
    //      VIEW 5 reused as bot-R (bedroom w/ two beds also on p41).
    //   5) slide 5 --half (page 42 pink-toned bedroom pair) is a placeholder:
    //      the two pink/peach bedroom renders shown in the PDF are NOT in the
    //      06_The-Edge/ folder, so the current half slide reuses WALK IN 3 +
    //      GUEST BEDROOM VIEW 5 until user provides the missing images.
    layouts: ['left', 'right', 'right', 'left', 'half'],
    images: [
      '/assets/images/projects/06_The-Edge/13-GG%20LIVING%20ROOM%20VIEW%205.webp',       // hero (page 37): overhead U-sofa
      // Slide 1 --left (page 38 interior overview) — clockwise-rotated per feedback: [LL,TR,BR] -> [BR,LL,TR]
      '/assets/images/projects/06_The-Edge/12-GG%20LIVING%20ROOM%20VIEW%204.webp',       // large L: overhead alt (was BR)
      '/assets/images/projects/06_The-Edge/9-GG%20LIVING%20ROOM%20VIEW%201.webp',         // top R:   sectional w/ tall windows (was LL)
      '/assets/images/projects/06_The-Edge/3-GF%20DINING%20VIEW%201.webp',                // bot R:   dining round table (was TR)
      // Slide 2 --right (page 39 lobby / staircase)
      '/assets/images/projects/06_The-Edge/8-GF%20LIFT.webp',                             // large R: lift / modern hallway (was top L)
      '/assets/images/projects/06_The-Edge/6-GF%20STAIRCASE%20VIEW%201.webp',             // top L:   staircase corner (was large R)
      '/assets/images/projects/06_The-Edge/GUEST%201%20WALK%20IN%201.webp',               // bot L:   walk-in transition
      // Slide 3 --right (page 40 guest bedroom)
      '/assets/images/projects/06_The-Edge/GUEST%20BEDROOM%201-VIEW%201.webp',            // large R: bedroom main (two beds)
      '/assets/images/projects/06_The-Edge/GUEST%20BEDROOM%201-VIEW%203.webp',            // top L:   bedside detail
      '/assets/images/projects/06_The-Edge/GUEST%20BEDROOM%201-VIEW%204.webp',            // bot L:   nightstand alt
      // Slide 4 --left (page 41 walk-in wardrobe) — NEW slide filling the gap
      '/assets/images/projects/06_The-Edge/GUEST%201%20WALK%20IN%203.webp',               // large L: walk-in w/ mirror & vanity
      '/assets/images/projects/06_The-Edge/GUEST%201%20WALK%20IN%201.webp',               // top R:   walk-in alt angle (reused — appears twice in PDF)
      '/assets/images/projects/06_The-Edge/GUEST%20BEDROOM%201-VIEW%205.webp',            // bot R:   bedroom w/ two beds warm-tone
      // Slide 5 --half  (page 42 pink-toned bedroom pair) — PLACEHOLDER
      // The two pink/peach bedroom renders in the PDF are not in the folder;
      // reusing WALK IN 3 + BEDROOM VIEW 5 until user provides new assets.
      '/assets/images/projects/06_The-Edge/GUEST%201%20WALK%20IN%203.webp',               // left:  PLACEHOLDER (reuse walk-in)
      '/assets/images/projects/06_The-Edge/GUEST%20BEDROOM%201-VIEW%205.webp',            // right: PLACEHOLDER (reuse bedroom warm-tone)
    ]
  },
  {
    id: 7,
    title: 'Axila by Homedge',
    location: 'Dubai, UAE',
    type: 'Commercial — Common Areas',
    description: `A modern mixed-use development with premium amenities. From the striking reception to the wellness spa and fitness center, every common space is designed to inspire.`,
    category: 'commercial',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 44-49.
    // Per feedback: some 3D renders in the PDF are horizontally mirrored versions
    // of the source webp files. We flip them at render time via CSS transform.
    layouts: ['left', 'right', 'half', 'right', 'left'],
    // Indices to horizontally flip (source assets unchanged):
    //   0  = hero (page 44)
    //   1  = slide 1 large-L (page 45)
    //   7,8 = slide 3 --half (page 47 corridor)
    //   9,10,11 = slide 4 --right (page 48 spa)
    //   12,13 = slide 5 --left large-L & top-R (page 49 parking)
    //   14 (Firestaircase bot-R) intentionally NOT flipped per feedback.
    flip: [0, 1, 7, 8, 9, 10, 11, 12, 13],
    images: [
      '/assets/images/projects/07_Axilla-By-Homedge/01%20-%20GF%20Reception_View%2005.webp',    // hero (page 44): reception wide (flipped)
      // Slide 1 --left  (page 45 reception continued)
      '/assets/images/projects/07_Axilla-By-Homedge/01%20-%20GF%20Reception_View%2002.webp',    // large L: AXILLA marble reception (flipped)
      '/assets/images/projects/07_Axilla-By-Homedge/01%20-%20GF%20Reception_View%2004.webp',    // top R:   reception angled
      '/assets/images/projects/07_Axilla-By-Homedge/01%20-%20GF%20Reception_View%2007.webp',    // bot R:   lift/elevator
      // Slide 2 --right (page 46 gym) — clockwise-rotated per feedback: [LR,TL,BL] -> [TL,BL,LR]
      '/assets/images/projects/07_Axilla-By-Homedge/04%20-%20Gym%20Area_View%2001.webp',        // large R: gym main (was TL)
      '/assets/images/projects/07_Axilla-By-Homedge/04%20-%20Gym%20Area_View%2003.webp',        // top L:   gym alt (was BL)
      '/assets/images/projects/07_Axilla-By-Homedge/04%20-%20Gym%20Area_View%2002.webp',        // bot L:   gym mirror wide (was LR)
      // Slide 3 --half  (page 47 corridor — flipped)
      '/assets/images/projects/07_Axilla-By-Homedge/02%20-%20Corridor_View%2002.webp',          // left:  corridor main (flipped)
      '/assets/images/projects/07_Axilla-By-Homedge/02%20-%20Corridor_View%2004.webp',          // right: corridor alt (flipped)
      // Slide 4 --right (page 48 spa — flipped) — clockwise-rotated per feedback
      '/assets/images/projects/07_Axilla-By-Homedge/05%20-%20Spa%20Area_View%2002.webp',        // large R: spa alt (was TL)
      '/assets/images/projects/07_Axilla-By-Homedge/05%20-%20Spa%20Area_View%2003.webp',        // top L:   spa reception (was BL)
      '/assets/images/projects/07_Axilla-By-Homedge/05%20-%20Spa%20Area_View%2001.webp',        // bot L:   spa MALE/FEMALE hallway (was LR)
      // Slide 5 --left  (page 49 parking + staircase — flipped, order fixed)
      '/assets/images/projects/07_Axilla-By-Homedge/03%20-%20Car%20Parking_View%2001.webp',     // large L: parking w/ car (flipped) — was top R
      '/assets/images/projects/07_Axilla-By-Homedge/03%20-%20Car%20Parking_View%2004.webp',     // top R:   parking w/ elevator (flipped) — was large L
      '/assets/images/projects/07_Axilla-By-Homedge/00%20-%20Firestaircase_View%2001.webp',     // bot R:   fire staircase (flipped)
    ]
  },
  {
    id: 8,
    title: 'The Key by Homedge',
    location: 'Dubai, UAE',
    type: 'Commercial — Common Areas',
    description: `A premium commercial development featuring sophisticated common areas. Reception, gym, spa, and corridors create a cohesive luxury experience.`,
    category: 'commercial',
    featured: true,
    // Ordered to match Website Project Grid PDF pages 51-56.
    // PDF layouts: p51=hero, p52=--left, p53=--right, p54=--half, p55=--right, p56=--left.
    layouts: ['left', 'right', 'half', 'right', 'left'],
    images: [
      '/assets/images/projects/08_The-Key-By-Homedge/RECEPTION/10%20-%20GF%20Reception_View%2008.jpg.webp',   // hero (page 51): THE KEY marble reception
      // Row 0 --left  (page 52 reception lounge) — slide 1 top-R <-> bot-R swapped per feedback
      '/assets/images/projects/08_The-Key-By-Homedge/RECEPTION/10%20-%20GF%20Reception_View%2004.jpg.webp',   // large L: lounge w/ bookshelf & sofa
      '/assets/images/projects/08_The-Key-By-Homedge/RECEPTION/10%20-%20GF%20Reception_View%2002.jpg.webp',   // top R:   tree w/ sofa detail (was bot R)
      '/assets/images/projects/08_The-Key-By-Homedge/RECEPTION/10%20-%20GF%20Reception_View%2003.jpg.webp',   // bot R:   lobby w/ tree (was top R)
      // Row 1 --right (page 53 gym)
      '/assets/images/projects/08_The-Key-By-Homedge/GYM/06%20-%20Gym%20Area_View%2001.jpg.webp',              // large R: gym w/ rowing machines
      '/assets/images/projects/08_The-Key-By-Homedge/GYM/06%20-%20Gym%20Area_View%2002.jpg.webp',              // top L:   gym alt
      '/assets/images/projects/08_The-Key-By-Homedge/GYM/06%20-%20Gym%20Area_View%2003.jpg.webp',              // bot L:   gym mirror
      // Row 2 --half  (page 54 corridor — 2 side by side) — swapped per feedback
      '/assets/images/projects/08_The-Key-By-Homedge/CORRIDOR/01%20-%20Corridor_View%2002.jpg.webp',           // left:  corridor alt (was right)
      '/assets/images/projects/08_The-Key-By-Homedge/CORRIDOR/01%20-%20Corridor_View%2001.jpg.webp',           // right: corridor main (was left)
      // Slide 4 --right (page 55 spa) — swap: large-R and bot-L reversed per feedback
      '/assets/images/projects/08_The-Key-By-Homedge/SPA/11%20-%20Spa%20Area_View%2003.jpg.webp',              // large R: spa w/ staircase (was bot L)
      '/assets/images/projects/08_The-Key-By-Homedge/SPA/11%20-%20Spa%20Area_View%2001.jpg.webp',              // top L:   spa MALE/FEMALE
      '/assets/images/projects/08_The-Key-By-Homedge/SPA/11%20-%20Spa%20Area_View%2002.jpg.webp',              // bot L:   spa w/ round wall light (was large R)
      // Row 4 --left  (page 56 parking + staircase)
      '/assets/images/projects/08_The-Key-By-Homedge/CAR%20PARKING/04%20-%20Car%20Parking_View%2004.jpg.webp', // large L: parking w/ elevator
      '/assets/images/projects/08_The-Key-By-Homedge/CAR%20PARKING/04%20-%20Car%20Parking_View%2002.jpg.webp', // top R:   parking area
      '/assets/images/projects/08_The-Key-By-Homedge/STAIRCASE/09%20-%20Staircase_View%2002A.jpg.webp',        // bot R:   staircase w/ 2 sign
    ]
  },
  {
    id: 9,
    title: 'Secret Garden',
    location: 'Dubai, UAE',
    type: 'Landscape Design',
    description: `A hidden oasis of landscape architecture \u2014 where greenery, water features, and outdoor living merge into a private paradise.`,
    category: 'landscape',
    featured: true,
    images: [
      '/assets/images/projects/09_Secret-Garden/1.webp',
    ]
  },
];

export const communitiesData = [
  {
    id: 2,
    name: 'PALM JUMEIRAH',
    logo: IMAGES.palmJumeirah
  },
  {
    id: 3,
    name: 'DUBAI HILLS ESTATE',
    logo: IMAGES.propertyLogo
  },
  {
    id: 4,
    name: 'JUMEIRAH ISLANDS',
    logo: IMAGES.tilalLogo
  },
  {
    id: 5,
    name: 'SOBHA HARTLAND',
    logo: IMAGES.original
  },
  {
    id: 7,
    name: 'SOULE STUDIO',
    logo: IMAGES.logo
  }
];

export const servicesData = [
  {
    id: 1,
    title: 'Architectural Design',
    description: 'We create innovative architectural solutions that blend functionality with aesthetic excellence, designing structures that stand the test of time.',
    applications: 'Residential villas, commercial buildings, urban planning.'
  },
  {
    id: 2,
    title: 'Interior Design',
    description: 'From bespoke layouts to handpicked finishes, we curate interiors that speak to our clients\' taste, lifestyle, and legacy. Every detail, from furniture to lighting, is chosen with purpose.',
    applications: 'Turnkey villas, concept homes, investment properties.'
  },
  {
    id: 3,
    title: 'Landscape Design',
    description: 'We integrate nature into architecture—designing gardens, courtyards, terraces, and outdoor features that amplify the experience of space.',
    applications: 'Pool areas, driveways, open-air lounges, villa gardens.'
  },
  {
    id: 4,
    title: 'High-End Project Execution',
    description: 'We translate approved designs into reality with a network of master craftsmen, site specialists, and project managers, ensuring quality and control at every stage of build and fit-out.',
    applications: 'Villa renovations, new constructions, luxury detailing.'
  }
];

export const teamData = [
  {
    id: 1,
    name: 'Sonali Potdar',
    role: 'FOUNDER & CEO',
    phone: '+971502702108',
    image: IMAGES.sonaliPotdar
  },
  {
    id: 2,
    name: 'Siddhesh Mule',
    role: 'MANAGING DIRECTOR',
    phone: '+971504452108',
    image: IMAGES.siddheshMule
  }
];

export const coreValues = [
  {
    title: 'Clarity through Design',
    description: 'Every space starts with intention and ends with harmony.'
  },
  {
    title: 'Innovative Visualisation',
    description: 'We help clients see their space before it\'s built.'
  },
  {
    title: 'Client-Centered Vision',
    description: 'We build relationships, not just residences.'
  },
  {
    title: 'Craft with Integrity',
    description: 'No shortcuts. No compromises.'
  },
  {
    title: 'Elegance in Execution',
    description: 'From drawings to delivery, detail is everything.'
  }
];
