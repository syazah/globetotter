import { Request, Response } from "express";
import AdminDB from "@db/admin";
import { StatusCodes } from "http-status-codes";

export const handleAddInfo = async (req: any, res: any) => {
  try {
    const data = req.body;
    const multipleInfo = req.query.multipleInfo;

    if (multipleInfo) {
      if (!Array.isArray(data)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Expected array of info objects" });
      }

      const results = {
        success: [] as any[],
        failures: [] as any[],
      };

      // Process all items sequentially
      for (const info of data) {
        if (
          !info.country ||
          !info.city ||
          !info.clues ||
          !info.fun_fact ||
          !info.trivia
        ) {
          results.failures.push({
            data: info,
            error: "Missing required fields",
          });
          continue;
        }

        try {
          const result = await AdminDB.addInfo(info);
          if (result) {
            results.success.push(result);
          } else {
            results.failures.push({
              data: info,
              error: "Failed to add info (city might already exist)",
            });
          }
        } catch (error) {
          results.failures.push({
            data: info,
            error: error.message,
          });
        }
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: `Successfully added ${results.success.length} items, ${results.failures.length} failures`,
        results,
      });
    } else {
      // Single info handling
      if (
        !data.country ||
        !data.city ||
        !data.clues ||
        !data.fun_fact ||
        !data.trivia
      ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Missing required fields" });
      }

      const result = await AdminDB.addInfo(data);
      if (!result) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Failed to add info (city might already exist)",
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Data added successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error in handleAddInfo:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "An error occurred while processing the request",
    });
  }
};
