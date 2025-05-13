const predefinedWorkouts = [

    // Upper Body Focus
    {
      name: "Push Day Power",
      description:
        "A strength-focused push day routine emphasizing compound lifts like bench press, overhead press, and dips. Designed to build mass and power in the chest, shoulders, and triceps while improving pushing mechanics.",
      target: ["pectorals", "delts", "triceps"],
      gender: "Male",
      age: { from: 20, to: 40 },
      weight: { from: 143, to: 220 },
      level: "Intermediate",
    },
    {
      name: "Pull Day Essentials",
      description:
        "An introductory pull workout ideal for back and arm development. Includes rows, assisted pull-ups, and curls to help build foundational strength and improve posture.",
      target: ["lats", "traps", "biceps"],
      gender: "Female",
      age: { from: 18, to: 50 },
      weight: { from: 110, to: 176 },
      level: "Beginner",
    },
  
    // Lower Body / Functional Focus
    {
      name: "Functional Fitness Blast",
      description:
        "Full-body training with a focus on explosive, functional movements. Incorporates dynamic exercises like kettlebell swings, lunges, and core stabilization for enhanced athletic performance.",
      target: ["quads", "glutes", "pectorals", "lats", "abs"],
      gender: "Female",
      age: { from: 18, to: 50 },
      weight: { from: 110, to: 198 },
      level: "Intermediate",
    },
    {
      name: "Beginner Bodyweight Routine",
      description:
        "An easy-to-follow bodyweight workout targeting large muscle groups. Focuses on squats, push-ups, and planks to build overall strength and movement confidence without equipment.",
      target: ["quads", "pectorals"],
      gender: "Female",
      age: { from: 16, to: 65 },
      weight: { from: 88, to: 176 },
      level: "Beginner",
    },
  
    // Specialized Workouts
    {
      name: "Core Crusher Advanced",
      description:
        "An advanced abdominal circuit using high-rep, high-intensity exercises such as hanging leg raises, Russian twists, and planks to strengthen the core and lower back.",
      target: "abs",
      gender: "Female",
      age: { from: 20, to: 40 },
      weight: { from: 121, to: 198 },
      level: "Advanced",
    },
  
    // Sport-Specific
    {
      name: "Runner's Strength Circuit",
      description:
        "A well-rounded circuit designed to prevent running injuries by strengthening the hamstrings, glutes, and core. Includes stability drills and single-leg movements.",
      target: ["hamstrings", "glutes", "abs"],
      gender: "Male",
      age: { from: 18, to: 60 },
      weight: { from: 110, to: 176 },
      level: "Intermediate",
    },
    {
      name: "Swimmer's Shoulder Builder",
      description:
        "A shoulder-focused workout emphasizing rotator cuff health, scapular control, and upper back strength to improve stroke power and prevent shoulder impingement.",
      target: ["delts", "traps"],
      gender: "Male",
      age: { from: 12, to: 30 },
      weight: { from: 88, to: 176 },
      level: "Intermediate",
    },
  
    // Lower Body
    {
      name: "Leg Day Burner",
      description:
        "A muscle-building lower-body workout featuring squats, Romanian deadlifts, lunges, and calf raises to maximize hypertrophy and endurance.",
      target: ["quads", "glutes", "hamstrings", "calves"],
      gender: "Female",
      age: { from: 20, to: 45 },
      weight: { from: 110, to: 220 },
      level: "Intermediate",
    },
    {
      name: "Glute Activation Circuit",
      description:
        "Targeted glute workout with hip thrusts, glute bridges, and band work. Ideal for warming up before leg day or as a standalone session to enhance glute isolation and activation.",
      target: ["glutes"],
      gender: "Female",
      age: { from: 18, to: 40 },
      weight: { from: 99, to: 154 },
      level: "Beginner",
    },
  
    // Core
    {
      name: "Core Strength for Beginners",
      description:
        "Beginner-friendly core routine focusing on controlled movements to engage the abdominals and improve posture. Great for anyone new to fitness or looking to build core stability.",
      target: "abs",
      gender: "Female",
      age: { from: 18, to: 30 },
      weight: { from: 110, to: 154 },
      level: "Beginner",
    },
    {
      name: "Core Strength for Beginners",
      description:
        "Core-focused training plan with planks, crunches, and leg raises. Designed to develop abdominal endurance and trunk strength for male beginners.",
      target: "abs",
      gender: "Male",
      age: { from: 18, to: 30 },
      weight: { from: 110, to: 164 },
      level: "Beginner",
    },
  
    // Full Body Bodyweight
    {
      name: "Full Body Bodyweight Blast",
      description:
        "Efficient full-body bodyweight workout that uses minimal equipment. Includes push-ups, squats, lunges, and planks to develop balanced strength and endurance.",
      target: ["quads", "glutes", "pectorals", "lats", "abs"],
      gender: "Male",
      age: { from: 20, to: 35 },
      weight: { from: 110, to: 164 },
      level: "Beginner",
    },
    {
      name: "Full Body Bodyweight Blast",
      description:
        "Progressive full-body bodyweight session with more advanced variations like pike push-ups, jump squats, and core holds for strength and body control.",
      target: ["quads", "glutes", "pectorals", "lats", "abs"],
      gender: "Male",
      age: { from: 20, to: 35 },
      weight: { from: 143, to: 187 },
      level: "Intermediate",
    },
  
    // Back Focus
    {
      name: "Back Mastery",
      description:
        "An advanced strength workout emphasizing the upper and lower back using exercises like barbell rows, pull-ups, and reverse flys to improve posture and power.",
      target: ["lats", "spine", "traps"],
      gender: "Male",
      age: { from: 25, to: 40 },
      weight: { from: 154, to: 198 },
      level: "Advanced",
    },
  
    // Upper Legs
    {
      name: "Lower Body Basics",
      description:
        "Beginner-friendly leg session with squats, glute bridges, and hamstring curls. A great starting point for developing strength in the upper legs.",
      target: ["quads", "hamstrings", "glutes"],
      gender: "Male",
      age: { from: 35, to: 45 },
      weight: { from: 143, to: 187 },
      level: "Beginner",
    },
    {
      name: "Lower Body Basics",
      description:
        "Gentle but effective lower-body workout for female beginners, emphasizing proper form in squats, hip thrusts, and hamstring activation.",
      target: ["quads", "hamstrings", "glutes"],
      gender: "Female",
      age: { from: 35, to: 45 },
      weight: { from: 143, to: 187 },
      level: "Beginner",
    },
  
    // Arms
    {
      name: "Arm Sculptor Starter",
      description:
        "An easy yet effective arm-toning workout for women, using light dumbbells and bodyweight to target the biceps, triceps, and shoulders.",
      target: ["biceps", "delts", "forearms", "triceps"],
      gender: "Female",
      age: { from: 18, to: 35 },
      weight: { from: 110, to: 154 },
      level: "Beginner",
    },
    {
      name: "Foundational Arm Strength",
      description:
        "Straightforward arm routine for men looking to build strength in the biceps, triceps, and shoulders. Ideal for beginners using resistance bands or light weights.",
      target: ["biceps", "delts", "forearms", "triceps"],
      gender: "Male",
      age: { from: 20, to: 35 },
      weight: { from: 110, to: 154 },
      level: "Beginner",
    },
  
    // Chest & Shoulders
    {
      name: "Chest & Shoulders Power",
      description:
        "Intermediate-level routine using compound lifts like incline bench press, dumbbell shoulder press, and push-ups to increase size and definition in the upper body.",
      target: ["pectorals", "delts"],
      gender: "Male",
      age: { from: 20, to: 40 },
      weight: { from: 143, to: 187 },
      level: "Intermediate",
    },
  
    {
      name: "Explosive Push Routine",
      description:
        "High-intensity push workout featuring clap push-ups, overhead presses, and dips to develop explosive strength in the chest, shoulders, and triceps.",
      target: ["pectorals", "delts", "triceps"],
      gender: "Male",
      age: { from: 22, to: 38 },
      weight: { from: 154, to: 198 },
      level: "Advanced",
    },
    {
      name: "Balanced Pull Routine",
      description:
        "Focuses on back and arm balance with pull-ups, rows, and reverse curls. Perfect for improving pulling mechanics and posture.",
      target: ["lats", "biceps", "traps"],
      gender: "Female",
      age: { from: 20, to: 45 },
      weight: { from: 99, to: 165 },
      level: "Intermediate",
    },
    {
      name: "Bodyweight Lower Burn",
      description:
        "No-equipment leg workout that builds endurance through high-rep squats, lunges, and glute bridges.",
      target: ["quads", "glutes", "hamstrings", "calves"],
      gender: "Female",
      age: { from: 18, to: 50 },
      weight: { from: 99, to: 176 },
      level: "Beginner",
    },
    {
      name: "Strength & Core Power",
      description:
        "Full-body workout emphasizing core engagement and total-body strength. Combines squats, deadlifts, and planks.",
      target: ["quads", "glutes", "abs", "spine"],
      gender: "Male",
      age: { from: 25, to: 45 },
      weight: { from: 154, to: 220 },
      level: "Intermediate",
    },
    {
      name: "Hamstring Hero",
      description:
        "Targeted posterior chain workout focused on strengthening hamstrings and glutes to prevent injury and improve sprint speed.",
      target: ["hamstrings", "glutes", "spine"],
      gender: "Male",
      age: { from: 20, to: 40 },
      weight: { from: 143, to: 198 },
      level: "Intermediate",
    },
    {
      name: "Cardio Core Fusion",
      description:
        "Cardiovascular-focused workout that integrates core movements and HIIT drills for fat burn and functional strength.",
      target: ["cardiovascular system", "abs", "quads"],
      gender: "Female",
      age: { from: 18, to: 35 },
      weight: { from: 99, to: 165 },
      level: "Intermediate",
    },
    {
      name: "Mobility & Strength Flow",
      description:
        "Combines mobility drills with functional strength movements to improve joint health and muscular endurance.",
      target: ["spine", "serratus anterior", "delts", "glutes"],
      gender: "Male",
      age: { from: 30, to: 50 },
      weight: { from: 143, to: 198 },
      level: "Intermediate",
    },
    {
      name: "Arm & Shoulder Express",
      description:
        "Quick upper-body blast with emphasis on toning biceps, triceps, and shoulders using bands or light dumbbells.",
      target: ["biceps", "triceps", "delts"],
      gender: "Female",
      age: { from: 20, to: 40 },
      weight: { from: 99, to: 143 },
      level: "Beginner",
    },
    {
      name: "HIIT Legs and Core",
      description:
        "Leg and core-based high-intensity interval workout focused on increasing lower-body power and core stability.",
      target: ["quads", "hamstrings", "abs", "calves"],
      gender: "Male",
      age: { from: 25, to: 40 },
      weight: { from: 154, to: 198 },
      level: "Intermediate",
    },
    {
      name: "Posture Perfection Plan",
      description:
        "Back and upper body plan for posture correction using rows, scapular pulls, and spinal mobility exercises.",
      target: ["spine", "traps", "levator scapulae", "upper back"],
      gender: "Female",
      age: { from: 30, to: 55 },
      weight: { from: 110, to: 165 },
      level: "Beginner",
    },
    {
      name: "Leg Sculpt & Stability",
      description:
        "Lower-body toning routine focused on glute and thigh shaping through isolated control and balance work.",
      target: ["glutes", "quads", "abductors", "adductors"],
      gender: "Female",
      age: { from: 25, to: 50 },
      weight: { from: 99, to: 176 },
      level: "Intermediate",
    },
    {
      name: "Powerlifting Prep",
      description:
        "Foundational strength program to build raw strength in all major lifts with core support work.",
      target: ["quads", "glutes", "pectorals", "spine"],
      gender: "Male",
      age: { from: 22, to: 35 },
      weight: { from: 165, to: 220 },
      level: "Advanced",
    },
    {
      name: "Toned Arms & Core Circuit",
      description:
        "Arm and core-focused workout perfect for women looking to tone without bulking.",
      target: ["biceps", "triceps", "abs", "delts"],
      gender: "Female",
      age: { from: 18, to: 35 },
      weight: { from: 99, to: 154 },
      level: "Beginner",
    },
    {
      name: "Strength for Runners",
      description:
        "Runner-focused routine emphasizing hip and core stability with strength work to enhance running economy.",
      target: ["glutes", "hamstrings", "abs"],
      gender: "Male",
      age: { from: 18, to: 45 },
      weight: { from: 132, to: 187 },
      level: "Intermediate",
    },
    {
      name: "Glute Builder Advanced",
      description:
        "Intense glute training session using hip thrusts, Bulgarian split squats, and resistance band circuits.",
      target: ["glutes", "hamstrings", "abductors"],
      gender: "Female",
      age: { from: 20, to: 40 },
      weight: { from: 110, to: 176 },
      level: "Advanced",
    },
    {
      name: "Upper Body Volume Pump",
      description:
        "A hypertrophy-focused upper body workout for muscle growth, targeting chest, shoulders, and arms.",
      target: ["pectorals", "delts", "biceps", "triceps"],
      gender: "Male",
      age: { from: 20, to: 35 },
      weight: { from: 143, to: 198 },
      level: "Intermediate",
    },
    {
      name: "Lower Body Power Circuit",
      description:
        "Power-based training session focusing on heavy compound movements to build strength and explosiveness.",
      target: ["quads", "glutes", "hamstrings", "calves"],
      gender: "Male",
      age: { from: 20, to: 40 },
      weight: { from: 165, to: 220 },
      level: "Advanced",
    },
    {
      name: "Home Body Sculpt",
      description:
        "A home-friendly routine for full-body toning using minimal equipment, ideal for busy schedules.",
      target: ["quads", "glutes", "abs", "pectorals"],
      gender: "Female",
      age: { from: 18, to: 45 },
      weight: { from: 99, to: 165 },
      level: "Beginner",
    },
    {
      name: "Delts of Steel",
      description:
        "Intense shoulder workout with overhead presses, lateral raises, and Arnold presses to shape defined delts.",
      target: ["delts", "traps", "pectorals"],
      gender: "Male",
      age: { from: 20, to: 40 },
      weight: { from: 143, to: 198 },
      level: "Intermediate",
    },
    {
      name: "Total Core Challenge",
      description:
        "A complete core circuit for building strength in the abs, obliques, and lower back through dynamic holds and movement.",
      target: ["abs"],
      gender: "Female",
      age: { from: 20, to: 40 },
      weight: { from: 110, to: 165 },
      level: "Advanced",
    }
  ];