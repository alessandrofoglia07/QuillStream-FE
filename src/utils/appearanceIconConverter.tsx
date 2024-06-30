import { FaUser, FaUserAstronaut, FaUserGraduate, FaUserInjured, FaUserDoctor, FaUserNinja, FaUserNurse, FaUserSecret, FaUserTie } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

const iconsArray = [FaUser, FaUserAstronaut, FaUserGraduate, FaUserInjured, FaUserDoctor, FaUserNinja, FaUserNurse, FaUserSecret, FaUserTie];

export const iconToAppearance = (icon: IconType): string => {
    const iconIndex = iconsArray.indexOf(icon);

    return (iconIndex + 1 || 1).toString();
};

export const appearanceToIcon = (appearance: string = '1', className?: string): React.ReactNode => {
    if (!appearance) return <FaUser className={className} />;

    const iconIndex = parseInt(appearance) - 1;

    const Icon = iconsArray[iconIndex];

    return Icon ? <Icon className={className} /> : <FaUser className={className} />;
};
