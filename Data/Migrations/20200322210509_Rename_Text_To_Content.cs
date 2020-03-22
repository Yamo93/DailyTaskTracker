using Microsoft.EntityFrameworkCore.Migrations;

namespace DailyTaskTracker.Data.Migrations
{
    public partial class Rename_Text_To_Content : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Text",
                table: "News");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "News",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "News");

            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "News",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
