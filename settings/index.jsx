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
        <TextInput
          label="ServerUrl"
          settingsKey="ServerUrl"
        />

        <Select                
          label={`Source`}
          settingsKey="SourceTyp"
          options={[
            { name: "Azure DevOps Server" },
            { name: "Git" },
            { name: "Dropbox" },
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
