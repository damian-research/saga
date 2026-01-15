namespace Saga.Data.Enums;

/// <summary>
/// Standard EAD3 levels of description
/// </summary>
public enum LevelOfDescription
{
    RecordGroup,
    Collection,
    Series,
    FileUnit,
    Item,
    Fonds
}

public static class LevelOfDescriptionExtensions
{
    /// <summary>
    /// Convert enum to EAD3 string value
    /// </summary>
    public static string ToEad3String(this LevelOfDescription level)
    {
        return level switch
        {
            LevelOfDescription.RecordGroup => "recordGroup",
            LevelOfDescription.Collection => "collection",
            LevelOfDescription.Series => "series",
            LevelOfDescription.FileUnit => "fileUnit",
            LevelOfDescription.Item => "item",
            LevelOfDescription.Fonds => "fonds",
            _ => "item"
        };
    }

    /// <summary>
    /// Parse string to enum (handles NARA variants)
    /// </summary>
    public static LevelOfDescription ParseLevel(string level)
    {
        if (string.IsNullOrWhiteSpace(level))
            return LevelOfDescription.Item;

        return level.ToLowerInvariant() switch
        {
            "recordgroup" or "recordgrp" => LevelOfDescription.RecordGroup,
            "collection" => LevelOfDescription.Collection,
            "series" => LevelOfDescription.Series,
            "fileunit" or "file" => LevelOfDescription.FileUnit,
            "item" => LevelOfDescription.Item,
            "fonds" => LevelOfDescription.Fonds,
            _ => LevelOfDescription.Item
        };
    }

    /// <summary>
    /// Get hierarchy order for sorting (0 = top level)
    /// </summary>
    public static int GetHierarchyOrder(this LevelOfDescription level)
    {
        return level switch
        {
            LevelOfDescription.RecordGroup => 0,
            LevelOfDescription.Fonds => 1,
            LevelOfDescription.Collection => 2,
            LevelOfDescription.Series => 3,
            LevelOfDescription.FileUnit => 4,
            LevelOfDescription.Item => 5,
            _ => 99
        };
    }

    /// <summary>
    /// Get display label
    /// </summary>
    public static string GetLabel(this LevelOfDescription level)
    {
        return level switch
        {
            LevelOfDescription.RecordGroup => "Record Group",
            LevelOfDescription.Collection => "Collection",
            LevelOfDescription.Series => "Series",
            LevelOfDescription.FileUnit => "File Unit",
            LevelOfDescription.Item => "Item",
            LevelOfDescription.Fonds => "Fonds",
            _ => "Item"
        };
    }
}