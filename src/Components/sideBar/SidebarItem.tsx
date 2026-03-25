import Link from 'next/link';
import Image from 'next/image';

const normalizeText = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
};

interface SidebarItemProps {
    title: string;
    icon: string;
    onClick?: () => void;
    compact?: boolean;
}

const SidebarItem = ({ title, icon, onClick, compact = false }: SidebarItemProps) => {
    const path = `/${normalizeText(title)}`;

    return (
        <Link
            href={path}
            onClick={onClick}
            className={`flex items-center ${compact ? 'gap-2 px-3 py-1.5 rounded-lg' : 'gap-3 px-4 py-2.5 rounded-xl'} hover:bg-white/5 active:bg-white/10 transition-all duration-200 group relative`}
        >
            <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-1 ${compact ? 'h-5' : 'h-6'} bg-primary rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center`}></div>
            <div className={`${compact ? 'w-7 h-7 rounded-md' : 'w-9 h-9 rounded-lg'} bg-deep/50 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors shrink-0`}>
                <Image
                    width={compact ? 15 : 18}
                    height={compact ? 15 : 18}
                    alt={title}
                    src={icon}
                    className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                />
            </div>
            <span className={`truncate ${compact ? 'text-[14px] font-medium' : 'text-sm font-semibold'} text-gray-300 group-hover:text-white transition-colors`}>{title}</span>

        </Link>
    );
};

export default SidebarItem;
