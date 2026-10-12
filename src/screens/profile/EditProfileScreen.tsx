import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { TextField } from '../../components/common/TextField';
import { FilterChip } from '../../components/common/FilterChip';
import { useLearning } from '../../hooks/useLearning';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { Theme } from '../../theme/theme';
import type { StackScreenProps } from '../../app/navigation/types';

type Props = StackScreenProps<'EditProfile'>;

const LEVELS = ['AI Explorer', 'AI Builder', 'AI Practitioner'];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    form: {
      gap: theme.spacing.lg,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    levels: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    saved: {
      ...theme.typography.body,
      color: theme.colors.success,
    },
  });

export function EditProfileScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const learning = useLearning();
  const [name, setName] = useState(learning.profile.name);
  const [bio, setBio] = useState(learning.profile.bio);
  const [level, setLevel] = useState(learning.profile.level);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const nextName = name.trim() || learning.profile.name;
    learning.updateProfile({
      name: nextName,
      bio: bio.trim(),
      level,
    });
    setSaved(true);
  };

  return (
    <ScreenContainer scroll includeBottomInset>
      <AppHeader title="Edit profile" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <TextField label="Display name" value={name} onChangeText={setName} />
        <TextField label="Bio" value={bio} onChangeText={setBio} multiline />
        <Text style={styles.label}>Learning level</Text>
        <View style={styles.levels}>
          {LEVELS.map(item => (
            <FilterChip
              key={item}
              label={item}
              selected={level === item}
              onPress={() => setLevel(item)}
            />
          ))}
        </View>
        <PrimaryButton label="Save profile" onPress={save} />
        {saved ? <Text style={styles.saved}>Saved on this device.</Text> : null}
      </View>
    </ScreenContainer>
  );
}
