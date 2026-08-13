interface ReactNode {
}

interface Props {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    children?: ReactNode;
    className?: string;
    textClassName?: string;
    forceCenter?: boolean;
    leftIcon?: ReactNode;
}

function Title({

               })