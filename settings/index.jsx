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

<Select                
          label={`Source`}
          settingsKey="SourceTyp"
          options={[
            { name: "Azure DevOps Server" },
            { name: "Git" },
            { name: "Dropbox" },
          ]}
        />

{ JSON.parse(props.settingsStorage.getItem("SourceTyp")).values[0].name === 'Dropbox' && 
    <TextInput
      label="Access-Token"
      placeholder="Enter your Access-Token"
      settingsKey="AccessToken"
/>
}

{ JSON.parse(props.settingsStorage.getItem("SourceTyp")).values[0].name !== 'Dropbox' && 
<TextInput
          label="ServerUrl"
          settingsKey="ServerUrl"
        />
}

      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
