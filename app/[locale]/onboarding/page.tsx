import { AditionalInfoSection } from '@/components/onboarding/AditionalInfoSection';
import { SummarySection } from '@/components/onboarding/SummarySection';
import { OnboardingFormProvider } from '@/context/OnboardingForm';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';

const Onboarding = async () => {
	const session = await checkIfUserCompletedOnboarding(true);

	return (
		<OnboardingFormProvider session={session}>
			<AditionalInfoSection profileImage={session.user.image} />
			<SummarySection />
		</OnboardingFormProvider>
	);
};
export default Onboarding;
