import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, icon: Icon, badge, right }) => {
    return (
        <div className="flex flex-col gap-1.5 mb-2">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-2.5"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {Icon && (
                        <div className="text-emerald-500 shrink-0">
                            <Icon size={24} strokeWidth={2.5} />
                        </div>
                    )}
                    <div className="flex items-center gap-2 min-w-0">
                        <h1 className="text-lg lg:text-xl font-black text-slate-800 dark:text-white tracking-tight truncate">
                            {title}
                        </h1>
                        {badge !== undefined && badge > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-rose-500 text-white text-[10px] sm:text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-rose-500/30 shrink-0"
                            >
                                {badge}
                            </motion.div>
                        )}
                    </div>
                </div>
                {right && <div className="shrink-0">{right}</div>}
            </motion.div>

            {subtitle && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-4"
                >
                    <div className="w-[2.5px] h-3.5 bg-emerald-500/80 rounded-full mt-0.5" />
                    <p className="text-xs font-semibold italic text-slate-500 dark:text-slate-400 leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default PageHeader;
