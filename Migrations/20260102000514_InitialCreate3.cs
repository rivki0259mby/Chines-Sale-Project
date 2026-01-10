using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Buyers_WinnerId",
                table: "Gifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Purchases_Buyers_BuyerId",
                table: "Purchases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Buyers",
                table: "Buyers");

            migrationBuilder.RenameTable(
                name: "Buyers",
                newName: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Donors",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Users_WinnerId",
                table: "Gifts",
                column: "WinnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Purchases_Users_BuyerId",
                table: "Purchases",
                column: "BuyerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Users_WinnerId",
                table: "Gifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Purchases_Users_BuyerId",
                table: "Purchases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Buyers");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Donors",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Buyers",
                table: "Buyers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Buyers_WinnerId",
                table: "Gifts",
                column: "WinnerId",
                principalTable: "Buyers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Purchases_Buyers_BuyerId",
                table: "Purchases",
                column: "BuyerId",
                principalTable: "Buyers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
