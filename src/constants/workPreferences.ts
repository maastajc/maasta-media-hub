export const WORK_PREFERENCE_CATEGORIES = [
  // Performing Artists
  { value: "actor", label: "Actor", group: "🎭 Performing Artists" },
  { value: "actress", label: "Actress", group: "🎭 Performing Artists" },
  { value: "dancer", label: "Dancer", group: "🎭 Performing Artists" },
  { value: "singer", label: "Singer", group: "🎭 Performing Artists" },
  { value: "voice_over_artist", label: "Voice-over Artist", group: "🎭 Performing Artists" },
  { value: "stand_up_comedian", label: "Stand-up Comedian", group: "🎭 Performing Artists" },
  { value: "theatre_artist", label: "Theatre Artist", group: "🎭 Performing Artists" },
  { value: "mime_artist", label: "Mime Artist", group: "🎭 Performing Artists" },
  { value: "anchor_host", label: "Anchor/Host", group: "🎭 Performing Artists" },
  { value: "magician", label: "Magician", group: "🎭 Performing Artists" },

  // Directorial & Creative Heads
  { value: "director_film_tv_web", label: "Director (Film/TV/Web)", group: "🎬 Directorial & Creative Heads" },
  { value: "assistant_director", label: "Assistant Director", group: "🎬 Directorial & Creative Heads" },
  { value: "creative_director", label: "Creative Director", group: "🎬 Directorial & Creative Heads" },
  { value: "showrunner", label: "Showrunner", group: "🎬 Directorial & Creative Heads" },
  { value: "script_supervisor", label: "Script Supervisor", group: "🎬 Directorial & Creative Heads" },

  // Writers
  { value: "scriptwriter", label: "Scriptwriter", group: "✍️ Writers" },
  { value: "screenwriter", label: "Screenwriter", group: "✍️ Writers" },
  { value: "dialogue_writer", label: "Dialogue Writer", group: "✍️ Writers" },
  { value: "story_developer", label: "Story Developer", group: "✍️ Writers" },
  { value: "lyricist", label: "Lyricist", group: "✍️ Writers" },
  { value: "copywriter", label: "Copywriter", group: "✍️ Writers" },

  // Sound & Music
  { value: "music_director_composer", label: "Music Director / Composer", group: "🎧 Sound & Music" },
  { value: "music_producer", label: "Music Producer", group: "🎧 Sound & Music" },
  { value: "sound_engineer", label: "Sound Engineer", group: "🎧 Sound & Music" },
  { value: "foley_artist", label: "Foley Artist", group: "🎧 Sound & Music" },
  { value: "mixing_mastering_engineer", label: "Mixing & Mastering Engineer", group: "🎧 Sound & Music" },
  { value: "dubbing_artist", label: "Dubbing Artist", group: "🎧 Sound & Music" },
  { value: "playback_singer", label: "Playback Singer", group: "🎧 Sound & Music" },
  { value: "sound_designer", label: "Sound Designer", group: "🎧 Sound & Music" },
  { value: "background_score_composer", label: "Background Score Composer", group: "🎧 Sound & Music" },

  // Cinematography & Visuals
  { value: "dop", label: "Director of Photography (DOP)", group: "🎥 Cinematography & Visuals" },
  { value: "cinematographer", label: "Cinematographer", group: "🎥 Cinematography & Visuals" },
  { value: "camera_operator", label: "Camera Operator", group: "🎥 Cinematography & Visuals" },
  { value: "drone_operator", label: "Drone Operator", group: "🎥 Cinematography & Visuals" },
  { value: "gaffer", label: "Gaffer", group: "🎥 Cinematography & Visuals" },
  { value: "focus_puller", label: "Focus Puller", group: "🎥 Cinematography & Visuals" },
  { value: "video_editor", label: "Video Editor", group: "🎥 Cinematography & Visuals" },
  { value: "colorist", label: "Colorist", group: "🎥 Cinematography & Visuals" },
  { value: "steadicam_operator", label: "Steadicam Operator", group: "🎥 Cinematography & Visuals" },

  // Post-Production
  { value: "video_editor_post", label: "Video Editor", group: "🖥️ Post-Production" },
  { value: "vfx_artist", label: "VFX Artist", group: "🖥️ Post-Production" },
  { value: "motion_graphics_designer", label: "Motion Graphics Designer", group: "🖥️ Post-Production" },
  { value: "cgi_specialist", label: "CGI Specialist", group: "🖥️ Post-Production" },
  { value: "color_grader", label: "Color Grader", group: "🖥️ Post-Production" },
  { value: "animation_artist", label: "Animation Artist", group: "🖥️ Post-Production" },
  { value: "di_technician", label: "DI Technician", group: "🖥️ Post-Production" },
  { value: "sound_designer_post", label: "Sound Designer", group: "🖥️ Post-Production" },
  { value: "subtitling_translation", label: "Subtitling & Translation", group: "🖥️ Post-Production" },

  // Costume & Styling
  { value: "costume_designer", label: "Costume Designer", group: "👗 Costume & Styling" },
  { value: "fashion_stylist", label: "Fashion Stylist", group: "👗 Costume & Styling" },
  { value: "wardrobe_assistant", label: "Wardrobe Assistant", group: "👗 Costume & Styling" },
  { value: "makeup_artist", label: "Makeup Artist", group: "👗 Costume & Styling" },
  { value: "hair_stylist", label: "Hair Stylist", group: "👗 Costume & Styling" },
  { value: "prosthetic_makeup_artist", label: "Prosthetic Makeup Artist", group: "👗 Costume & Styling" },
  { value: "sfx_makeup_artist", label: "SFX Makeup Artist", group: "👗 Costume & Styling" },

  // Production Support & Crew
  { value: "line_producer", label: "Line Producer", group: "🛠️ Production Support & Crew" },
  { value: "executive_producer", label: "Executive Producer", group: "🛠️ Production Support & Crew" },
  { value: "production_controller", label: "Production Controller", group: "🛠️ Production Support & Crew" },
  { value: "location_manager", label: "Location Manager", group: "🛠️ Production Support & Crew" },
  { value: "casting_director", label: "Casting Director", group: "🛠️ Production Support & Crew" },
  { value: "art_director", label: "Art Director", group: "🛠️ Production Support & Crew" },
  { value: "set_designer", label: "Set Designer", group: "🛠️ Production Support & Crew" },
  { value: "props_master", label: "Props Master", group: "🛠️ Production Support & Crew" },
  { value: "production_assistant", label: "Production Assistant", group: "🛠️ Production Support & Crew" },
  { value: "spot_boy", label: "Spot Boy", group: "🛠️ Production Support & Crew" },
  { value: "lightman", label: "Lightman", group: "🛠️ Production Support & Crew" },
  { value: "set_dresser", label: "Set Dresser", group: "🛠️ Production Support & Crew" },
  { value: "unit_manager", label: "Unit Manager", group: "🛠️ Production Support & Crew" },
  { value: "crew_coordinator", label: "Crew Coordinator", group: "🛠️ Production Support & Crew" },

  // Media Tech & Broadcast
  { value: "broadcast_engineer", label: "Broadcast Engineer", group: "🎙️ Media Tech & Broadcast" },
  { value: "live_stream_technician", label: "Live Stream Technician", group: "🎙️ Media Tech & Broadcast" },
  { value: "ott_content_manager", label: "OTT Content Manager", group: "🎙️ Media Tech & Broadcast" },
  { value: "media_asset_manager", label: "Media Asset Manager", group: "🎙️ Media Tech & Broadcast" },
  { value: "playout_operator", label: "Playout Operator", group: "🎙️ Media Tech & Broadcast" },
  { value: "satellite_transmission_operator", label: "Satellite Transmission Operator", group: "🎙️ Media Tech & Broadcast" },

  // Business, Marketing & Distribution
  { value: "producer", label: "Producer", group: "💼 Business, Marketing & Distribution" },
  { value: "co_producer", label: "Co-Producer", group: "💼 Business, Marketing & Distribution" },
  { value: "marketing_head", label: "Marketing Head", group: "💼 Business, Marketing & Distribution" },
  { value: "distribution_executive", label: "Distribution Executive", group: "💼 Business, Marketing & Distribution" },
  { value: "public_relations_officer", label: "Public Relations Officer", group: "💼 Business, Marketing & Distribution" },
  { value: "film_sales_agent", label: "Film Sales Agent", group: "💼 Business, Marketing & Distribution" },
  { value: "ott_content_aggregator", label: "OTT Content Aggregator", group: "💼 Business, Marketing & Distribution" },
  { value: "event_manager", label: "Event Manager", group: "💼 Business, Marketing & Distribution" },

  // Institutions & Service Providers
  { value: "film_production_house", label: "Film Production House", group: "🏢 Institutions & Service Providers" },
  { value: "ott_platform", label: "OTT Platform (e.g., Netflix, Hotstar)", group: "🏢 Institutions & Service Providers" },
  { value: "tv_channel", label: "TV Channel (e.g., Star Plus, Zee)", group: "🏢 Institutions & Service Providers" },
  { value: "advertising_agency", label: "Advertising Agency", group: "🏢 Institutions & Service Providers" },
  { value: "talent_agency", label: "Talent Agency", group: "🏢 Institutions & Service Providers" },
  { value: "casting_agency", label: "Casting Agency", group: "🏢 Institutions & Service Providers" },
  { value: "recording_studio", label: "Recording Studio", group: "🏢 Institutions & Service Providers" },
  { value: "dubbing_studio", label: "Dubbing Studio", group: "🏢 Institutions & Service Providers" },
  { value: "vfx_studio", label: "VFX Studio", group: "🏢 Institutions & Service Providers" },
  { value: "post_production_house", label: "Post-Production House", group: "🏢 Institutions & Service Providers" },
  { value: "shooting_house_set_rentals", label: "Shooting House / Set Rentals", group: "🏢 Institutions & Service Providers" },
  { value: "caravan_providers", label: "Caravan Providers", group: "🏢 Institutions & Service Providers" },
  { value: "equipment_rental_services", label: "Equipment Rental Services (camera, lighting, sound)", group: "🏢 Institutions & Service Providers" },

  // Digital Creators & Influencers
  { value: "youtuber", label: "YouTuber", group: "📲 Digital Creators & Influencers" },
  { value: "instagram_influencer", label: "Instagram Influencer", group: "📲 Digital Creators & Influencers" },
  { value: "podcast_host", label: "Podcast Host", group: "📲 Digital Creators & Influencers" },
  { value: "streamer", label: "Streamer (Twitch, YouTube Live)", group: "📲 Digital Creators & Influencers" },
  { value: "short_video_creator", label: "Short Video Creator (Reels, Josh, Moj)", group: "📲 Digital Creators & Influencers" },
  { value: "meme_creator", label: "Meme Creator", group: "📲 Digital Creators & Influencers" },
  { value: "content_strategist", label: "Content Strategist", group: "📲 Digital Creators & Influencers" },

  // Educational & Training Bodies
  { value: "acting_school", label: "Acting School", group: "🎓 Educational & Training Bodies" },
  { value: "film_institutes", label: "Film Institutes", group: "🎓 Educational & Training Bodies" },
  { value: "dance_academy", label: "Dance Academy", group: "🎓 Educational & Training Bodies" },
  { value: "music_school", label: "Music School", group: "🎓 Educational & Training Bodies" },
  { value: "voice_training_academy", label: "Voice Training Academy", group: "🎓 Educational & Training Bodies" },
  { value: "vfx_animation_institute", label: "VFX & Animation Institute", group: "🎓 Educational & Training Bodies" },

  // Audiences & Communities
  { value: "cinema_fans", label: "Cinema Fans", group: "👥 Audiences & Communities" },
  { value: "film_critics", label: "Film Critics", group: "👥 Audiences & Communities" },
];

export const WORK_PREFERENCE_GROUPS = [
  "🎭 Performing Artists",
  "🎬 Directorial & Creative Heads", 
  "✍️ Writers",
  "🎧 Sound & Music",
  "🎥 Cinematography & Visuals",
  "🖥️ Post-Production",
  "👗 Costume & Styling",
  "🛠️ Production Support & Crew",
  "🎙️ Media Tech & Broadcast",
  "💼 Business, Marketing & Distribution",
  "🏢 Institutions & Service Providers",
  "📲 Digital Creators & Influencers",
  "🎓 Educational & Training Bodies",
  "👥 Audiences & Communities",
];