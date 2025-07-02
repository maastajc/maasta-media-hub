
export const validateUniqueEntry = <T extends { [key: string]: any }>(
  newEntry: Partial<T>,
  existingEntries: T[],
  compareFields: (keyof T)[]
): { isValid: boolean; message?: string } => {
  const isDuplicate = existingEntries.some(existing => 
    compareFields.every(field => {
      const newValue = newEntry[field];
      const existingValue = existing[field];
      
      // Case-insensitive comparison for strings
      if (typeof newValue === 'string' && typeof existingValue === 'string') {
        return newValue.toLowerCase().trim() === existingValue.toLowerCase().trim();
      }
      
      return newValue === existingValue;
    })
  );

  if (isDuplicate) {
    const fieldNames = compareFields.map(field => String(field)).join(' and ');
    return {
      isValid: false,
      message: `An entry with the same ${fieldNames} already exists.`
    };
  }

  return { isValid: true };
};

export const validateSkillEntry = (skill: string, existingSkills: Array<{ skill: string }>) => {
  return validateUniqueEntry({ skill }, existingSkills, ['skill']);
};

export const validateToolEntry = (tool_name: string, existingTools: Array<{ tool_name: string }>) => {
  return validateUniqueEntry({ tool_name }, existingTools, ['tool_name']);
};

export const validateLanguageEntry = (
  language: string, 
  proficiency: string, 
  existingLanguages: Array<{ language: string; proficiency: string }>
) => {
  return validateUniqueEntry({ language, proficiency }, existingLanguages, ['language']);
};

export const validateAwardEntry = (
  title: string,
  organization: string,
  year: number,
  existingAwards: Array<{ title: string; organization?: string; year?: number }>
) => {
  return validateUniqueEntry({ title, organization, year }, existingAwards, ['title', 'organization', 'year']);
};
