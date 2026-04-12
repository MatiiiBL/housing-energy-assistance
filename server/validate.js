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
  existingBenefits: z
    .array(
      z.enum([
        'snap',
        'medicaid',
        'ssi',
        'tanf',
        'none',
        'heap_regular',
        'liheap',
        'wic',
        'public_assistance',
        'section8',
      ])
    )
    .refine(
      (vals) => !vals.includes('none') || vals.length <= 1,
      'Select specific programs or None, not both'
    ),
  householdMembers: z.object({
    hasChildUnder6: z.boolean(),
    hasSenior60Plus: z.boolean(),
    hasDisabledMember: z.boolean(),
  }),
  language: z.enum(['en', 'es']),
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

/**
 * Validates POST /api/assess body. Assessments use Claude (Anthropic) on the server; not configurable per request.
 */
function validateAssessRequest(body) {
  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    return {
      valid: false,
      errors: [{ field: '_', message: 'Invalid request body' }],
    };
  }
  const profileResult = HouseholdProfileSchema.safeParse(body);
  if (!profileResult.success) {
    const errors = profileResult.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      profile: profileResult.data,
    },
  };
}

module.exports = { validateProfile, validateAssessRequest };
