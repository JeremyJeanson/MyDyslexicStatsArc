import { gettext } from "i18n";

const colorSet = [
  { color: "black" },
  { color: "darkslategrey" },
  { color: "dimgrey" },
  { color: "grey" },
  { color: "lightgrey" },
  { color: "beige" },
  { color: "white" },
  { color: "maroon" },
  { color: "saddlebrown" },
  { color: "darkgoldenrod" },
  { color: "goldenrod" },
  { color: "rosybrown" },
  { color: "wheat" },
  { color: "navy" },
  { color: "blue" },
  { color: "dodgerblue" },
  { color: "deepskyblue" },
  { color: "aquamarine" },
  { color: "cyan" },
  { color: "olive" },
  { color: "darkgreen" },
  { color: "green" },
  { color: "springgreen" },
  { color: "limegreen" },
  { color: "palegreen" },
  { color: "lime" },
  { color: "greenyellow" },
  { color: "darkslateblue" },
  { color: "slateblue" },
  { color: "purple" },
  { color: "fuchsia" },
  { color: "plum" },
  { color: "orchid" },
  { color: "lavender" },
  { color: "darkkhaki" },
  { color: "khaki" },
  { color: "lemonchiffon" },
  { color: "yellow" },
  { color: "gold" },
  { color: "orangered" },
  { color: "orange" },
  { color: "coral" },
  { color: "lightpink" },
  { color: "palevioletred" },
  { color: "deeppink" },
  { color: "darkred" },
  { color: "crimson" },
  { color: "red" }
];

registerSettingsPage(({ settings, settingsStorage }) => {
  return (
    <Page>
      <Section
        title="Options">
        <Toggle
          settingsKey="clockDisplay24"
          label={gettext("clockDisplay24")} />          
        <Toggle
          settingsKey="showBatteryPourcentage"
          label={gettext("showBatteryPourcentage")} />
        <Toggle
          settingsKey="showBatteryBar"
          label={gettext("showBatteryBar")} />
      </Section>
      <Section
        title={gettext("backgroundColor")}>
        <ColorSelect
          settingsKey="colorBackground"
          colors={colorSet} />
      </Section>
      <Section
        title={gettext("textColor")}>
        <ColorSelect
          settingsKey="colorForeground"
          colors={colorSet} />
      </Section>
    </Page>
  );
});