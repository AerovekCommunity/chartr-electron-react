
import { Delete } from '@mui/icons-material';

export default function WalletWord(props: any): JSX.Element {
    return (
        <div key={props.wordNumber} className="mnemonic-word">
            <span className="mnemonic-word-number">
                {props.wordNumber}
            </span>
            <span>
                {props.word}
            </span>
            {props.showDeleteButton &&
                <span>
                    <Delete />
                </span>
            }
        </div>
    );
}