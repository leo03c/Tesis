'use client';

import React, { useEffect } from 'react';
import { FiX, FiAlertTriangle, FiInfo, FiCheck } from 'react-icons/fi';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger',
    isLoading = false
}: ConfirmModalProps) => {

    // Bloquear el scroll cuando esté abierta
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <FiAlertTriangle className="text-red-500" size={24} />,
                    iconBg: 'bg-red-500/10',
                    btnClass: 'bg-red-500 hover:bg-red-600 text-white',
                };
            case 'warning':
                return {
                    icon: <FiAlertTriangle className="text-yellow-500" size={24} />,
                    iconBg: 'bg-yellow-500/10',
                    btnClass: 'bg-yellow-500 hover:bg-yellow-600 text-white text-gray-900',
                };
            case 'success':
                return {
                    icon: <FiCheck className="text-green-500" size={24} />,
                    iconBg: 'bg-green-500/10',
                    btnClass: 'bg-green-500 hover:bg-green-600 text-white',
                };
            default: // info
                return {
                    icon: <FiInfo className="text-primary" size={24} />,
                    iconBg: 'bg-primary/10',
                    btnClass: 'bg-primary hover:bg-primary/80 text-white',
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => !isLoading && onClose()}
            />
            
            {/* Modal Content */}
            <div 
                role="dialog" 
                aria-modal="true"
                className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
            >
                {/* Botón de cerrar superior */}
                <button 
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
                >
                    <FiX size={20} />
                </button>

                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${styles.iconBg}`}>
                        {styles.icon}
                    </div>
                    <div className="flex-1 pt-1 pr-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${styles.btnClass}`}
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        ) : null}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;