import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

interface LetterAvatarsProps {
    className?: string;
    fName: string;
}

export default function LetterAvatars({ className, fName }: LetterAvatarsProps) {
    return (
        <Stack direction="row" spacing={2} className={className}>
            <Avatar sx={{
                    bgcolor: "#FBEFEF", width: 30, height: 30, fontSize: "1rem",
                    color: "#F5AFAF", cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                        color: "#F6B6B6",
                    }
                }}
            >
                {fName}
            </Avatar>
        </Stack>
    );
}
