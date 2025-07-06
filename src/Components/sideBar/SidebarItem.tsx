import Link from 'next/link';
import Image from 'next/image';

const SidebarItem = ({ title, icon }: { title: string; icon: string }) => {
    const path = `/${title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <Link 
            href={path}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
        >
            <Image 
                width={20} 
                height={20} 
                alt={title} 
                src={icon} 
                className="flex-shrink-0 "
            />
            <span className="whitespace-nowrap text-text">{title}</span>
        </Link>
    );
};

export default SidebarItem;
