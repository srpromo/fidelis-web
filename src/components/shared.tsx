import type { Dispatch } from 'react';
import type { ResearchRun } from '../types';
import type { Action } from '../state/research';
import { ArrowRight } from 'lucide-react';
export type Props = {
    run: ResearchRun;
    dispatch: Dispatch<Action>;
};
export function Button({ children, onClick, disabled = false }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}) {
    return <button className="primary" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={17}/>
    </button>;
}
