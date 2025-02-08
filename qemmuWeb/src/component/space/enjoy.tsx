import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { PhasherLoad } from "./phaserLoad";

export default function Enjoy() {
    const gameContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!gameContainerRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.WEBGL,
            width: '90%',
            height: '100%',
            backgroundColor: '#2d2d2d',
            parent: gameContainerRef.current,
            pixelArt: true,
            scene: PhasherLoad
        };

        const game = new Phaser.Game(config);

        return () => {
            // Bersihkan game saat komponen di-unmount
            game.destroy(true);
        };
    }, []);

    return <div ref={gameContainerRef} id="game-container" />;
}
