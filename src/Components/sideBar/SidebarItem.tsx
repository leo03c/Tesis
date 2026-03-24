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
}

const SidebarItem = ({ title, icon, onClick }: SidebarItemProps) => {
    const path = `/${normalizeText(title)}`;

    return (
        <Link
            href={path}
            onClick={onClick}
            className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 active:bg-white/10 rounded-xl transition-all duration-200 group relative"
        >
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-6 bg-primary rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
            <div className="w-8 h-8 rounded-lg bg-deep/50 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors shrink-0">
                <Image
                    width={18}
                    height={18}
                    alt={title}
                    src={icon}
                    className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                />
            </div>
            <span className="truncate text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{title}</span>

        </Link>
    );
};

export default SidebarItem;
