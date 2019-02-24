function settingsComponent(props) {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Time is Money and money is Time 
            Settings
          </Text>
        }
      >
      <Toggle
          settingsKey="toggle"
          label="Toggle Switch"
        />
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'}
          ]}
        />
        </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
