// ... inside currentProjects array ...
    {
      id: 'showreel',
      title: t.projects.showreel.title,
      description: t.projects.showreel.desc,
      link: '#', 
      type: 'video',
      component: <VideoProjectCard 
                    id="showreel"
                    year="2025"
                    title="Showreel"
                    videoSources={[
                      {
                        previewUrl: "https://youtu.be/3j9_y-s5_DI",
                        fullUrl: "https://youtu.be/3j9_y-s5_DI" 
                      }
                    ]}
                 />
    },
    {
      id: 'surreal',
      title: t.projects.surreal.title,
      description: t.projects.surreal.desc,
      link: '#',
      type: 'video',
      component: <VideoProjectCard 
                    id="surreal"
                    year="2025"
                    title="Surrealness"
                    videoSources={[
                      {
                        previewUrl: "https://youtu.be/h_yqJ-r_SgE",
                        fullUrl: "https://youtu.be/h_yqJ-r_SgE"
                      },
                      {
                        previewUrl: "https://youtu.be/qM-jY_x_V_k",
                        fullUrl: "https://youtu.be/qM-jY_x_V_k"
                      }
                    ]}
                 />
    },
// ...
