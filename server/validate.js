const { z } = require('zod');

const HouseholdProfileSchema = z.object({
  householdSize: z
    .number()
    .int()
    .min(1, 'Household size must be at least 1')
    .max(20, 'Household size must be 20 or fewer'),
  annualIncome: z
    .number()
    .min(0, 'Annual income cannot be negative')
    .max(500000, 'Annual income seems unusually high — please double-check'),
  borough: z.enum(['bronx', 'brooklyn', 'manhattan', 'queens', 'staten_island'], {
    errorMap: () => ({ message: 'Please select a valid NYC borough' }),
  }),
  housingType: z.enum(
    ['renter_heat_included', 'renter_pay_utilities', 'homeowner', 'public_housing'],
    { errorMap: () => ({ message: 'Please select a valid housing type' }) }
  ),
  utilityProvider: z.enum(['con_edison', 'national_grid', 'nyseg', 'other'], {
    errorMap: () => ({ message: 'Please select a utility provider' }),
  }),
  monthlyEnergyBill: z
    .number()
    .min(0, 'Monthly bill cannot be negative')
    .max(2000, 'Monthly bill seems unusually high'),
  existingBenefits: z.array(z.enum(['snap', 'medicaid', 'ssi', 'tanf', 'none'])),
  householdMembers: z.object({
    hasChildUnder6: z.boolean(),
    hasSenior60Plus: z.boolean(),
    hasDisabledMember: z.boolean(),
  }),
  language: z.enum([
  'en','es','zh-hans','zh-hant','bn','ru','ht','ko','ar','fr','pl',
  'ur','tl','it','yi','el','hi','pt','he','vi','ja','sq','am','pa','tr','sw'
]),
});

function validateProfile(body) {
  const result = HouseholdProfileSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

module.exports = { validateProfile };
