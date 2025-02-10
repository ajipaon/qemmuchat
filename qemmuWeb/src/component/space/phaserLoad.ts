import Phaser from "phaser";

export class PhaserLoad extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "PhaserLoad" }); // Tambahkan key untuk scene
  }

  preload(): void {
    this.load.setBaseURL("/phaser-assets");
    this.load.image("tiles", "assets/tilemaps/tiles/tmw_desert_spacing.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/maps/desert.json");
    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create(): void {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("Desert", "tiles");

    if (!tileset) {
      console.error("Tileset 'Desert' tidak ditemukan");
      return;
    }

    const layer = this.map.createLayer("Ground", tileset, 0, 0);
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

    this.cursors = this.input.keyboard!.createCursorKeys() || {
      left: { isDown: false },
      right: { isDown: false },
      up: { isDown: false },
      down: { isDown: false },
    };

    this.player = this.physics.add.sprite(0, 0, "player");
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, layer);
  }

  update(_time: number, delta: number): void {
    if (!this.cursors) {
      return; // Hentikan jika cursor keys tidak tersedia
    }

    // Reset player velocity
    this.player.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("walk", true);
      this.player.flipX = true; // Flip sprite jika bergerak ke kiri
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("walk", true);
      this.player.flipX = false; // Jangan flip sprite jika bergerak ke kanan
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play("walk", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      this.player.anims.play("walk", true);
    }

    // Jika tidak ada tombol yang ditekan, stop animasi
    if (
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown &&
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown
    ) {
      this.player.anims.stop();
    }
  }
}
