import Phaser from "phaser";

export class PhasherLoad extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private controls!: Phaser.Cameras.Controls.FixedKeyControl;

  preload() {
    this.load.setBaseURL("https://cdn.phaserfiles.com/v385");
    this.load.image("tiles", "assets/tilemaps/tiles/tmw_desert_spacing.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/maps/desert.json");
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tiles = this.map.addTilesetImage("Desert", "tiles");
    if (!tiles) {
      console.error("Tileset 'Desert' tidak ditemukan");
      return;
    }

    const layer = this.map.createLayer("Ground", tiles, 0, 0);
    if (!layer) {
      console.error("Layer 'Ground' tidak ditemukan");
      return;
    }

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    const cursors = this.input.keyboard?.createCursorKeys();
    if (!cursors) {
      console.error("Input keyboard tidak tersedia");
      return;
    }

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    });

    const help = this.add.text(
      16,
      16,
      "Click a tile to swap all instances of it with a sign.",
      {
        fontSize: "18px",
        padding: { x: 10, y: 5 },
        backgroundColor: "#000000",
        // fill: "#ffffff",
      }
    );
    help.setScrollFactor(0);
  }

  update(_time: number, delta: number) {
    // Update kontrol kamera
    this.controls.update(delta);

    // Handle klik untuk menukar tile
    if (this.input.manager.activePointer.isDown) {
      const worldPoint = this.input.activePointer.positionToCamera(
        this.cameras.main
      );
      if (worldPoint instanceof Phaser.Math.Vector2) {
        const tile = this.map.getTileAtWorldXY(worldPoint.x, worldPoint.y);
        if (tile) {
          this.map.swapByIndex(tile.index, 46);
        }
      }
    }
  }
}
