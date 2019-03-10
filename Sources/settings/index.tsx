const colorSet = [
    {color: "black"},
    {color: "darkslategrey"},
    {color: "dimgrey"},
    {color: "grey"},
    {color: "lightgrey"},
    {color: "beige"},
    {color: "white"},
    {color: "maroon"},
    {color: "saddlebrown"},
    {color: "darkgoldenrod"},
    {color: "goldenrod"},
    {color: "rosybrown"},
    {color: "wheat"},
    {color: "navy"},
    {color: "blue"},
    {color: "dodgerblue"},
    {color: "deepskyblue"},
    {color: "aquamarine"},
    {color: "cyan"},
    {color: "olive"},
    {color: "darkgreen"},
    {color: "green"},
    {color: "springgreen"},
    {color: "limegreen"},
    {color: "palegreen"},
    {color: "lime"},
    {color: "greenyellow"},
    {color: "darkslateblue"},
    {color: "slateblue"},
    {color: "purple"},
    {color: "fuchsia"},
    {color: "plum"},
    {color: "orchid"},
    {color: "lavender"},
    {color: "darkkhaki"},
    {color: "khaki"},
    {color: "lemonchiffon"},
    {color: "yellow"},
    {color: "gold"},
    {color: "orangered"},
    {color: "orange"},
    {color: "coral"},
    {color: "lightpink"},
    {color: "palevioletred"},
    {color: "deeppink"},
    {color: "darkred"},
    {color: "crimson"},
    {color: "red"}       
  ];
    
  registerSettingsPage(({ settings, settingsStorage })=>
    {
    return (
      <Page>
          <Section
            title="Background Color">
            <ColorSelect
              settingsKey="colorBackground"
              colors={colorSet} />
          </Section>
          <Section
            title="Text Color">
            <ColorSelect
              settingsKey="colorForeground"
              colors={colorSet} />
          </Section>
      </Page>
    );
  });