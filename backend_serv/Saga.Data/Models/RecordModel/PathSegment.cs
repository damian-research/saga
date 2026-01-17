namespace Saga.Data.Models.RecordModel;

public sealed class PathSegment
{
    /// <summary>
    /// Archival level (EAD semantics), e.g. "recordgrp", "series", "file", "fonds"
    /// </summary>
    public string Level { get; set; } = string.Empty;

    /// <summary>
    /// Human-readable label, e.g. "RG# 34445", "Series Motion Pictures"
    /// </summary>
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Archive-specific identifier (string for cross-archive support)
    /// </summary>
    public string Id { get; set; } = string.Empty;
}